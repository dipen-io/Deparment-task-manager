import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, Navigate, useNavigate } from "react-router";
import { Mail, Lock } from "lucide-react";
import { loginUser } from "../api/authApi";
import toast from "react-hot-toast";

export function LoginPage() {
    const { user, loading, saveData } = useAuth();

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [Loading, setLoading] = useState(false);

    if (loading) return <div>Loading...</div>;
    if (user) return <Navigate to="/" replace />;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const payload = {
            email,
            password,
        };

        try {
            const data = await loginUser(payload);
            toast.success(data.message);
            saveData(data.data.user, data.data.accessToken);
            navigate("/", { replace: true });
        } catch (error: any) {
            // setError(error)
            const errorMessage =
                error?.response?.data?.message ||
                error.message ||
                "Login failed";
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 justify-center mb-8"
                >
                    <div className="w-10 h-10 bg-[#14b8a6] rounded-lg" />
                    <span className="text-2xl text-gray-900">TaskManager</span>
                </Link>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-center text-gray-900 mb-2">
                        Welcome back
                    </h1>
                    <p className="text-center text-gray-600 mb-8">
                        Sign in to your account
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block mb-2 text-gray-700">
                                Email
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setError("");
                                        setEmail(e.target.value);
                                    }}
                                    placeholder="you@example.com"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/20 focus:border-[#14b8a6]"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block mb-2 text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setError("");
                                        setPassword(e.target.value);
                                    }}
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/20 focus:border-[#14b8a6]"
                                    required
                                />
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="text-sm text-[#14b8a6] hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit */}
                        <button
                            disabled={Loading}
                            type="submit"
                            className="w-full py-3 bg-[#14b8a6] text-white rounded-lg hover:bg-[#14b8a6]/90 transition-colors"
                        >
                            {Loading ? "Signing.." : "Sign In"}
                        </button>
                        {error && (
                            <p className="text-red-700 text-center font-bold">
                                {" "}
                                {error}{" "}
                            </p>
                        )}
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-center text-gray-600 mt-6">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-[#14b8a6] hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
