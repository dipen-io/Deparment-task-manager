import {
    createContext,
    useState,
    useEffect,
    useContext,
    useCallback,
} from "react";
import type { ReactNode } from "react";
import type { User } from "../components/types/userType"
import { useQueryClient } from "@tanstack/react-query";

// interface User {
//     _id: string; // ✅ match MongoDB field
//     name: string; // ✅ add name too
//     email: string;
//     role: Roles;
//     department: Department;
//     userType: "admin" | "head" | "member";
// }

// interface Roles {
//     _id: string;
//     name: string;
//     permissions: string[];
// }
// interface Department {
//     _id: string;
//     name: string;
//     description: string;
// }

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    saveData: (userData: User, accessToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const queryClient = useQueryClient();

    // ✅ useCallback makes logout stable — safe to use inside useEffect
    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        queryClient.clear();
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }, []);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");

        if (savedUser && savedUser !== "undefined") {
            try {
                const parsedUser = JSON.parse(savedUser);
                if (parsedUser && typeof parsedUser === "object") {
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error("Failed to parse user from localStorage", error);
                localStorage.removeItem("user");
            }
        }

        if (savedToken) {
            setToken(savedToken);
        }

        setLoading(false);

        const handleTokenRefresh = (e: Event) => {
            const customEvent = e as CustomEvent<string>;
            setToken(customEvent.detail);
        };

        const handleTokenExpired = () => {
            logout(); // ✅ now uses stable reference
        };

        window.addEventListener("onTokenRefresh", handleTokenRefresh);
        window.addEventListener("onTokenExpired", handleTokenExpired);

        return () => {
            window.removeEventListener("onTokenRefresh", handleTokenRefresh);
            window.removeEventListener("onTokenExpired", handleTokenExpired);
        };
    }, [logout]); // ✅ logout is stable so this only runs once

    const saveData = (userData: User, accessToken: string) => {
        setUser(userData);
        setToken(accessToken);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", accessToken);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                saveData,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
