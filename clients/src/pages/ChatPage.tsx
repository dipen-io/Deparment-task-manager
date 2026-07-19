import { useAuth } from "../context/AuthContext"

export default function ChatPage() {
    const { user } = useAuth();
    console.log("USER FROM CHAT:", user)
    return (<>
        <h1>Your Chat</h1>
    </>)
}