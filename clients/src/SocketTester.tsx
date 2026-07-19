import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function SocketTester() {
    const [connectionState, setConnectionState] = useState({
        connected: false,
        socketId: "",
        error: ""
    });

    useEffect(() => {
        const socket = io("http://localhost:8080");

        socket.on('connect', () => {
            console.log("Connected to server successfully! My ID is:", socket.id);
            setConnectionState({
                connected: true,
                socketId: socket.id || "",
                error: ""
            });

            // just for testing
            socket.emit("send_message", { msg: "Hey server, it works!" });
        });

        socket.on("connect_error", (err) => {
            console.error("Connection error", err.message);
            setConnectionState(prev => ({ ...prev, error: err.message }));
        });

        socket.on("disconnect", (reason) => {
            console.log("Frontend disconnected:", reason);
            setConnectionState({
                connected: false,
                socketId: "",
                error: `Disconnected: ${reason}`
            });
        });

        // Cleanup
        return () => {
            // FIX 3: Fixed the typo "conect" -> "connect"
            socket.off("connect");
            socket.off("connect_error");
            socket.off("disconnect");
            socket.disconnect();
        };
    }, []);

    return (
        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", margin: "20px" }}>
            <h3>Sync Engine Debugger</h3>
            <p>Status: <strong>{connectionState.connected ? "🟢 Online" : "🔴 Offline"}</strong></p>
            {connectionState.socketId && <p>Socket ID: <code>{connectionState.socketId}</code></p>}
            {connectionState.error && <p style={{ color: "red" }}>Error: {connectionState.error}</p>}
        </div>
    );
}
