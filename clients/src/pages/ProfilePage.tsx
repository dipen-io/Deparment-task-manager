import { useAuth } from "../context/AuthContext";
import { User, Mail, ShieldCheck, Briefcase, Calendar } from "lucide-react";

export function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 animate-pulse">
          Loading profile details...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">
          Manage your personal information and view your role permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-[#14b8a6]/10 rounded-full flex items-center justify-center mb-4 border-2 border-[#14b8a6]">
            <User size={48} className="text-[#14b8a6]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <span className="mt-2 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-full">
            ID: {user._id || "N/A"}
          </span>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
            {/* Email Row */}
            <div className="p-4 flex items-center gap-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">
                  Email Address
                </p>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
            </div>

            {/* Role Row */}
            <div className="p-4 flex items-center gap-4">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">
                  Access Role
                </p>
                <p className="text-gray-900 font-medium capitalize">
                  {user.role?.name?.replace("_", " ")}
                </p>
              </div>
            </div>

            {/* Department Row */}
            <div className="p-4 flex items-center gap-4">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">
                  Department
                </p>
                <p className="text-gray-900 font-medium capitalize">
                  {user.department?.name || "All Access"}
                </p>
              </div>
            </div>

            {/* Account Status */}
            <div className="p-4 flex items-center gap-4">
              <div className="p-2 bg-green-50 rounded-lg text-green-600">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">
                  Account Status
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <p className="text-gray-900 font-medium">Active</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats / RBAC Summary */}
          <div className="bg-[#14b8a6]/5 rounded-2xl p-6 border border-[#14b8a6]/20">
            <h3 className="text-sm font-bold text-[#0d9488] mb-3 uppercase tracking-tight">
              Permission Level Overview
            </h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-700 flex items-center gap-2">
                ✅ View {user.userType === "admin" ? "all" : "department"} tasks
              </li>

              <li className="text-sm text-gray-700 flex items-center gap-2">
                ✅{" "}
                {user.userType === "member" ? "update assinged task and view" : ""}
              </li>
              {user.userType !== "member" && (
                <li className="text-sm text-gray-700 flex items-center gap-2">
                  ✅ Create and manage team tasks[cite: 1]
                </li>
              )}
              {user.userType === "admin" && (
                <li className="text-sm text-gray-700 flex items-center gap-2">
                  ✅ Modify user roles and departments[cite: 1]
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
