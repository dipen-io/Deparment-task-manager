import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) throw new Error('useSocket  must be used within a Socket');

    return context;
}

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const { user, token } = useAuth();

    useEffect(() => {
        if (!user || !token) {
            if (socket) {
                socket.disconnect();
            }
            return;
        }
        const socketInstance = io("http://localhost:8080", {
            autoConnect: false,
            // transports: ['websocket', 'polling'],
            // withCredentials: true,
        });

        socketInstance.auth = { token };

        socketInstance.connect();

        socketInstance.on('connect', () => {
            setIsConnected(true);
            console.log('🟢 Real-time sync engine active. ID:', socketInstance.id);
        })

        setSocket(socketInstance);

        return () => {
            socketInstance.off('connect');
            socketInstance.off('disconnect');
            socketInstance.disconnect();
        };

    }, [user, token]);
    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}