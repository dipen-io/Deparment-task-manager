import { useAuth } from "../context/AuthContext"
import { useSocket } from "../context/SocketContext";

export default function ChatPage() {
    const { user } = useAuth();
    const { socket, isConnected } = useSocket();
    console.log("USER FROM CHAT:", user)
    console.log("socket: ", socket);
    console.log("isConnected: ", isConnected);


    return (<>
        <h1>Your Chat</h1>

        {/* ⚡ PLUG THE DEBUGGER HERE AT THE BOTTOM */}

    </>)
}