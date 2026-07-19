import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { UseGetChat } from "../hooks/useChat";

export default function ChatPage() {
    const { user } = useAuth();
    const { socket, isConnected } = useSocket();
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingOlder, setIsFetchingOlder] = useState(false);

    // ⚡ FIX 1: This ref must point directly to the inner scrollable viewport box!
    const chatContainerRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    const [typingUsers, setTypingUsers] = useState([]);
    const isTypingLocalRef = useRef(false);
    const typingTimeoutRef = useRef(null);

    const messagesEndRef = useRef(null);
    const departmentId = user?.department?._id;

    const { data: response, isLoading } = UseGetChat({ deptId: departmentId });

    useEffect(() => {
        const historicalData = response?.data?.chat || response?.data?.messages || response?.data;
        if (historicalData && Array.isArray(historicalData)) {
            setMessages(historicalData);
        }
    }, [response]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Only auto-scroll down if the user isn't actively reading older history chunks
        const container = chatContainerRef.current;
        if (container && container.scrollTop > container.scrollHeight - container.clientHeight - 200) {
            scrollToBottom();
        } else if (messages.length <= 50) {
            scrollToBottom(); // Always snap down on initial load batch
        }
    }, [messages]);

    useEffect(() => {
        // ⚡ FIX 2: Added safe optional chaining protection guards
        if (!socket || !isConnected || !departmentId) return;

        socket.emit('join_dept', { departmentId, user });

        socket.on('receive_message', (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        socket.on('user_typing', ({ username, isTyping }) => {
            setTypingUsers((prev) => {
                if (isTyping) {
                    return prev.includes(username) ? prev : [...prev, username];
                } else {
                    return prev.filter((name) => name !== username);
                }
            });
        });

        return () => {
            socket.emit('leave_dept', { departmentId });
            socket.off('receive_message');
            socket.off('user_typing');
        };
    }, [socket, isConnected, departmentId, user]);

    const handleSendMsg = (e) => {
        e.preventDefault();
        if (!text.trim() || !socket) return;

        clearTimeout(typingTimeoutRef.current);
        isTypingLocalRef.current = false;
        socket.emit('typing', { departmentId, username: user?.name, isTyping: false });

        const messagePayload = {
            departmentId,
            senderId: user?._id,
            senderType: user?.userType || user?.role,
            senderName: user?.name,
            message: text.trim(),
        };

        socket.emit("send_message", messagePayload);
        setText('');
    };

    const handleInputChange = (e) => {
        setText(e.target.value);

        if (!socket || !isConnected || !departmentId) return;

        if (!isTypingLocalRef.current) {
            isTypingLocalRef.current = true;
            socket.emit('typing', { departmentId, username: user?.name, isTyping: true });
        }

        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            isTypingLocalRef.current = false;
            socket.emit('typing', { departmentId, username: user?.name, isTyping: false });
        }, 2000);
    };

    const handleScroll = async () => {
        const container = chatContainerRef.current;
        if (!container || isFetchingOlder || !hasMore) return;

        if (container.scrollTop === 0) {
            setIsFetchingOlder(true);

            const oldestMessage = messages[0];
            if (!oldestMessage) {
                setIsFetchingOlder(false);
                return;
            }

            try {
                const previousHeight = container.scrollHeight;

                // ⚡ FIX 3: Target the absolute backend server URL path explicitly
                const url = `http://localhost:8080/api/v1/chat/${departmentId}?before=${encodeURIComponent(oldestMessage.createdAt)}`;
                const res = await fetch(url);
                const data = await res.json();

                if (data.messages && data.messages.length > 0) {
                    setMessages((prev) => [...data.messages, ...prev]);
                    setHasMore(data.hasMore);

                    setTimeout(() => {
                        container.scrollTop = container.scrollHeight - previousHeight;
                    }, 0);
                } else {
                    setHasMore(false);
                }
            } catch (err) {
                console.error("Failed to load older historical chunks:", err);
            } finally {
                setIsFetchingOlder(false);
            }
        }
    };

    return (
        <div className="flex flex-col h-[850px] w-full max-w-full mx-auto border rounded-xl shadow-md bg-slate-50 overflow-hidden">
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

            {/* ⚡ FIX 4: Ref and onScroll attached directly to the actual scrollable view panel! */}
            <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#efeae2]"
            >
                {isLoading && (
                    <div className="text-center text-xs text-slate-500 my-4">Loading secure history logs...</div>
                )}

                {isFetchingOlder && (
                    <div className="text-center text-xs text-slate-500 my-2">Loading older context...</div>
                )}

                {!isLoading && messages.length === 0 && (
                    <div className="text-center text-xs text-slate-400 my-4">No historical records found. Start the conversation!</div>
                )}

                {messages.map((msg, index) => {
                    const isMyMessage = msg.senderId === user?._id;

                    return (
                        <div
                            key={msg._id || index}
                            className={`flex w-full ${isMyMessage ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`max-w-[75%] rounded-lg px-3 py-1.5 shadow-sm text-sm relative pb-5
                                ${isMyMessage
                                    ? "bg-[#d9fdd3] text-slate-900 rounded-tr-none"
                                    : "bg-white text-slate-900 rounded-tl-none"
                                }`}
                            >
                                {!isMyMessage && (
                                    <p className="text-[11px] font-bold text-emerald-600 block mb-0.5">
                                        {msg.senderName}
                                        {msg.senderType === 'head' && (
                                            <span className="ml-1.5 bg-red-100 text-red-700 text-[9px] font-extrabold px-1 rounded uppercase tracking-wider">
                                                Head
                                            </span>
                                        )}
                                    </p>
                                )}

                                <p className="leading-relaxed text-base break-words pr-4">{msg.message}</p>

                                {/* ⚡ FIX 5: Repaired "absolutes" typo to let styles anchor layout */}
                                <span className="absolute bottom-1 right-2 text-[9px] text-slate-400 select-none">
                                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Real-time typing display bar remains right above entry line */}
            {typingUsers.length > 0 && (
                <div className="px-4 py-1.5 bg-[#efeae2] text-xs italic text-slate-500 font-medium flex items-center gap-1.5 transition-all border-t border-slate-200">
                    <span className="flex space-x-0.5 items-center inline-block">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </span>
                    {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
                </div>
            )}

            <form onSubmit={handleSendMsg} className="p-3 bg-[#f0f2f5] border-t flex items-center gap-2">
                <input
                    value={text}
                    onChange={handleInputChange}
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 transform rotate-45 -translate-x-0.5 translate-y-0.5">
                        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                    </svg>
                </button>
            </form>
        </div>
    );
}