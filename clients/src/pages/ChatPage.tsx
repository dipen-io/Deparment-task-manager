import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { UseGetChat } from "../hooks/useChat";

export default function ChatPage() {
    const { user } = useAuth();
    const { socket, isConnected } = useSocket();
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingOlder, setIsFetchingOlder] = useState(false);
    const chatContainerRef = useRef(null);

    // Named 'messages' (plural) since it holds the chat history array
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    const messagesEndRef = useRef(null);
    const departmentId = user?.department?._id;

    // 1. Fetch initial chat history via HTTP REST hook
    const { data: response, isLoading } = UseGetChat({ deptId: departmentId });

    // 2. Sync HTTP History to state securely (prevents infinite re-render loop)
    useEffect(() => {
        const historicalData = response?.data?.chat || response?.data?.messages || response?.data;
        if (historicalData && Array.isArray(historicalData)) {
            setMessages(historicalData);
        }
    }, [response]);

    // 3. Smooth scroll anchor logic to auto-snap to newest message updates
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 4. WebSocket Lifecycle: Handle room entry, listening, and cleanup routines
    useEffect(() => {
        if (!socket || !isConnected || !departmentId) return;

        // Tell server we are entering this specific department chat room
        socket.emit('join_dept', { departmentId, user });

        // Listen for live broadcast messages from other room members
        socket.on('receive_message', (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        // Clean up listeners and leave room context on unmount
        return () => {
            socket.emit('leave_dept', { departmentId });
            socket.off('receive_message');
        };
    }, [socket, isConnected, departmentId, user]);

    // 5. Fire outgoing messages down the real-time pipe
    const handleSendMsg = (e) => {
        e.preventDefault();
        if (!text.trim() || !socket) return;

        const messagePayload = {
            departmentId,
            senderId: user._id,
            senderName: user.name,
            message: text.trim(),
        };

        socket.emit("send_message", messagePayload);
        setText('');
    };
    const handleScroll = async () => {
        const container = chatContainerRef.current;
        if (!container || isFetchingOlder || !hasMore) return;

        // Detect if the user has scrolled to the absolute top of the chat box
        if (container.scrollTop === 0) {
            setIsFetchingOlder(true);

            // Isolate the oldest message currently on screen
            const oldestMessage = messages[0];
            if (!oldestMessage) {
                setIsFetchingOlder(false);
                return;
            }

            try {
                // Snapshot the height before the new elements are injected
                const previousHeight = container.scrollHeight;

                // Fetch the next slice from your API passing the oldest timestamp as the cursor
                const url = `/api/v1/chat/${departmentId}?before=${encodeURIComponent(oldestMessage.createdAt)}`;
                const res = await fetch(url); // Replace with your Axios/Hook fetching instance if needed
                const data = await res.json();

                if (data.messages && data.messages.length > 0) {
                    // Prepend older history to the top, keeping live updates at the bottom
                    setMessages((prev) => [...data.messages, ...prev]);
                    setHasMore(data.hasMore);

                    // Prevent screen jumping: Adjust scrollbar layout down by exactly how much the container grew
                    setTimeout(() => {
                        container.scrollTop = container.scrollHeight - previousHeight;
                    }, 0);
                } else {
                    setHasMore(false); // Reached the beginning of time in this chat room
                }
            } catch (err) {
                console.error("Failed to load older historical chunks:", err);
            } finally {
                setIsFetchingOlder(false);
            }
        }
    };

    return (
        <div className="flex flex-col h-[850px] w-full max-w-full mx-auto border rounded-xl shadow-md bg-slate-50 overflow-hidden"
            ref={chatContainerRef}
            onScroll={handleScroll}
        >
            {/* Department Header Badge Bar */}
            <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
                <div>
                    <h2 className="font-semibold text-sm tracking-wide">
                        {user?.department?.name || "Department Chat"}
                    </h2>
                    <p className="text-xs text-slate-400">
                        {isConnected ? "🟢 Real-time connection active" : "🔴 Reconnecting pipeline..."}
                    </p>
                </div>
            </div>

            {/* Chat Viewport Screen (WhatsApp Style layout stacking logic) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#efeae2]">
                {isLoading && (
                    <div className="text-center text-xs text-slate-500 my-4">Loading secure history logs...</div>
                )}

                {!isLoading && messages.length === 0 && (
                    <div className="text-center text-xs text-slate-400 my-4">No historical records found. Start the conversation!</div>
                )}
                {isFetchingOlder && <div className="text-center text-xs text-slate-500">Loading older context...</div>}
                {messages.map((msg, index) => {
                    // Check if current message document object belongs to the logged-in user
                    const isMyMessage = msg.senderId === user?._id;

                    return (
                        <div
                            key={msg._id || index}
                            className={`flex w-full ${isMyMessage ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`max-w-[75%] rounded-lg px-3 py-1.5 shadow-sm text-sm relative
                                ${isMyMessage
                                    ? "bg-[#d9fdd3] text-slate-900 rounded-tr-none"
                                    : "bg-white text-slate-900 rounded-tl-none"
                                }`}
                            >
                                {/* Render sender signature block name tag exclusively for team member records */}
                                {!isMyMessage && (
                                    <p className="text-[11px] font-bold text-emerald-600 block mb-0.5">
                                        {msg.senderName}
                                    </p>
                                )}

                                <p className="leading-relaxed text-xl break-words pr-8">{msg.message}</p>

                                {/* Clean inline timestamp tag positioning rule */}
                                <span className="absolutes bottom-2 right-4 text-[9px] text-slate-400 select-none">
                                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                </span>
                            </div>
                        </div>
                    );
                })}
                {/* Scroll Target Element Anchor Node */}
                <div ref={messagesEndRef} />
            </div>

            {/* Sticky Lower WhatsApp Style Control Input Form Wrapper */}
            <form onSubmit={handleSendMsg} className="p-3 bg-[#f0f2f5] border-t flex items-center gap-2">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 border border-slate-200 rounded-full px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400"
                    placeholder="Type a message..."
                />
                <button
                    type="submit"
                    disabled={!text.trim() || !isConnected}
                    className={`rounded-full p-2 text-white transition-all shadow-sm
                        ${text.trim() && isConnected
                            ? "bg-emerald-600 hover:bg-emerald-700 active:scale-95 cursor-pointer"
                            : "bg-slate-300 cursor-not-allowed"
                        }`}
                >
                    {/* SVG Paper Airplane Delivery Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 transform rotate-45 -translate-x-0.5 translate-y-0.5">
                        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                    </svg>
                </button>
            </form>
        </div>
    );
}