import { useAuth } from "../context/AuthContext";
import { User, Mail, ShieldCheck, Briefcase, ShieldAlert, Award } from "lucide-react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { GetMyRole } from "../hooks/useRole";

export function ProfilePage() {
  const { user } = useAuth();
  const userId = user?._id;

  // Fetch permissions dynamic hook
  const { data: res, isLoading } = GetMyRole(userId!);
  const roleName = res?.data?.roles?.name || "No System Role Assigned";

  // Set up the permission array from server payload or fallback gracefully
  const permissionsList = res?.data?.roles?.permission || [];


  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <LoadingSpinner />
        <p className="text-sm font-semibold text-slate-400 animate-pulse tracking-wide">
          Retrieving secure profile payload...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 font-sans">

      {/* 🌟 PAGE HEADER HEADER */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
        <div className="p-2.5 bg-teal-50 rounded-xl text-teal-600 shadow-sm">
          <User size={24} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">My Profile</h1>
          <p className="text-xs md:text-sm font-medium text-slate-400 mt-0.5">
            Manage your credential identity scope and view authorized role policies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

        {/* 🪪 LEFT COLUMN: HERO AVATAR DISPLAY CARD */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center text-center shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-teal-400 via-[#14b8a6] to-cyan-500" />

          {/* Avatar frame container */}
          <div className="w-24 h-24 bg-gradient-to-br from-teal-50 to-slate-50 rounded-2xl flex items-center justify-center mb-4 border-2 border-teal-500/20 shadow-inner group-hover:scale-105 transition-transform duration-200">
            <User size={44} className="text-[#14b8a6]" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">{user.name}</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1 lowercase truncate max-w-full px-2">
            {user.email}
          </p>

          <div className="w-full border-t border-slate-50 my-4 pt-4 flex flex-col gap-2">
            <span className="px-3 py-1 bg-slate-50 border border-slate-150 text-slate-500 font-mono text-[10px] font-bold tracking-wider rounded-lg shadow-sm truncate">
              UID: {user._id || "N/A"}
            </span>
            <span className="px-3 py-1 bg-teal-50/60 border border-teal-100/50 text-[#0d9488] text-[10px] font-extrabold uppercase tracking-widest rounded-lg">
              {user.userType || "Staff"} Account
            </span>
          </div>
        </div>

        {/* ⚙️ RIGHT COLUMN: PROPERTY SHEET DETAILS & SYSTEM ROLES */}
        <div className="md:col-span-2 space-y-6">

          {/* USER INFO GRID TRACK SECTION */}
          <div className="bg-white rounded-2xl border border-slate-100 p-2 shadow-sm divide-y divide-slate-50">

            {/* Email Field Row */}
            <div className="p-4 flex items-center gap-4 group hover:bg-slate-50/50 transition-colors duration-150 rounded-t-xl">
              <div className="p-2.5 bg-blue-50/70 border border-blue-100/40 rounded-xl text-blue-600 shadow-sm shrink-0">
                <Mail size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Email Address</p>
                <p className="text-sm text-slate-700 font-semibold truncate mt-0.5">{user.email}</p>
              </div>
            </div>

            {/* Role Parameter Field Row */}
            <div className="p-4 flex items-center gap-4 group hover:bg-slate-50/50 transition-colors duration-150">
              <div className="p-2.5 bg-purple-50/70 border border-purple-100/40 rounded-xl text-purple-600 shadow-sm shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Assigned Identity</p>
                <p className="text-sm text-slate-700 font-bold capitalize mt-0.5">{roleName}</p>
              </div>
            </div>

            {/* Department Parameter Field Row */}
            <div className="p-4 flex items-center gap-4 group hover:bg-slate-50/50 transition-colors duration-150">
              <div className="p-2.5 bg-amber-50/70 border border-amber-100/40 rounded-xl text-amber-600 shadow-sm shrink-0">
                <Briefcase size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Department Assignment</p>
                <p className="text-sm text-slate-700 font-bold capitalize mt-0.5">
                  {user.department?.name || "Global Workspace Scope"}
                </p>
              </div>
            </div>

            {/* Profile Status Flag Row */}
            <div className="p-4 flex items-center gap-4 group hover:bg-slate-50/50 transition-colors duration-150 rounded-b-xl">
              <div className="p-2.5 bg-emerald-50/70 border border-emerald-100/40 rounded-xl text-emerald-600 shadow-sm shrink-0">
                <Award size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Roster Standing</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <p className="text-xs text-emerald-700 font-bold tracking-wide uppercase">Operational & Active</p>
                </div>
              </div>
            </div>

          </div>

          {/* 🔐 SECURITY CAPABILITIES OVERLAY LAYER */}
          {isLoading ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-8 flex justify-center shadow-sm">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-teal-50/30 via-white to-slate-50 border border-teal-500/10 rounded-2xl p-6 shadow-sm">
              <div className="mb-4">
                <h4 className="text-xs font-extrabold text-[#0d9488] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-teal-500 shrink-0" />
                  Authorized Token Keychains
                </h4>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  Cryptographic policy boundaries attached to your active access group level.
                </p>
              </div>

              {permissionsList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                  {permissionsList.map((perm: any, idx: number) => (
                    <div
                      key={perm._id || idx}
                      className="p-3 bg-white border border-slate-150 rounded-xl hover:border-teal-500/20 hover:shadow-sm transition-all duration-150 group"
                    >
                      <span className="font-mono text-xm font-bold text-slate-700 block tracking-tight group-hover:text-teal-600 transition-colors">
                        {perm.name}
                      </span>
                      {perm.desc && (
                        <span className="text-[15px] text-slate-400 font-medium block leading-tight mt-1">
                          {perm.desc}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* Clear Fallback Layer when permissionsList array length === 0 */
                <div className="p-4 bg-amber-50/40 border border-amber-200/50 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 font-medium">
                  <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">No Specialized Feature Tokens Detected</span>
                    <span className="text-slate-500 font-normal block mt-0.5 leading-normal">
                      This role operates on standard baseline workspace access scopes. Contact your system admin if this is unexpected.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}