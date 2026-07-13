import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User } from "lucide-react";
import { signupUser } from "../api/authApi";
import toast from "react-hot-toast";
import axios from "axios";

// Helper for consistent styling without repeating config objects
const notifyError = (msg: string) =>
  toast.error(msg, {
    duration: 4000,
    position: "top-center",
    style: {
      background: "#FFF4F4",
      color: "#D32F2F",
      border: "1px solid #D32F2F",
    },
  });

export function SignupPage() {
  const { user, saveData } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation Logic
    if (!formData.name) return notifyError("Please enter your Full Name");
    if (!formData.email) return notifyError("Please enter your Email");
    if (!formData.password) return notifyError("Please enter a Password");

    setLoading(true);

    try {
      // Sends just name, email, password. Role & Dept will be set by admin later.
      const response = await signupUser(formData);
      toast.success(response.message || "Account created!");
      saveData(response.data.user, response.data.accessToken);
      navigate("/", { replace: true });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        notifyError(err.response?.data?.message || err.message);
      } else {
        notifyError("Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 bg-[#14b8a6] rounded-lg" />
          <span className="text-2xl font-bold text-gray-900">TaskManager</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Create your account
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Get started with TaskManager today
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Name */}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Dipen Boro"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6]/20 focus:border-[#14b8a6] outline-none transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6]/20 focus:border-[#14b8a6] outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6]/20 focus:border-[#14b8a6] outline-none transition-all"
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-3 bg-[#14b8a6] text-white font-bold rounded-lg hover:bg-[#0d9488] transition-colors disabled:opacity-50 mt-4 shadow-lg shadow-[#14b8a6]/20"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#14b8a6] font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}