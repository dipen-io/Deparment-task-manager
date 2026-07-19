import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";


interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

export const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) throw new Error('useSocket  must be used within a Socket');

    return context;
}

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
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