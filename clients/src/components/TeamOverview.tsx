import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { getRole, type RoleResponse } from "../api/roleApi";
import { useDept } from "../hooks/useDepartment";
import { ChevronDown, Search, SlidersHorizontal, X, Users, Briefcase, Building2, UserCheck } from "lucide-react";
import { useUserNormal } from "../hooks/useUser";

export function TeamOverview() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState<RoleResponse | null>(null);

  // Custom Dropdown Active Toggle States
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);

  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const deptDropdownRef = useRef<HTMLDivElement>(null);

  // ⏱️ Debounce Text Logic Layer
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(delayTimer);
  }, [searchQuery]);

  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.userType === "admin";

  const { data: res } = useUserNormal({ search: debouncedSearch });
  const usersData = res?.data?.users;

  // Filter Members matching selection criteria
  const filteredMembers = usersData?.filter((user: any) => {
    const matchesRole = roleFilter === "all" || user.roles?._id === roleFilter;
    const matchesDept = deptFilter === "all" || user.department?._id === deptFilter;
    return matchesRole && matchesDept;
  });

  const { data: response } = useDept({ search: undefined, limit: 100 });
  const dept = response?.data?.data || [];

  // Dropdown filtering logic 
  const filteredDepartments = dept.filter((d: any) => {
    if (!search.trim()) return true;
    return (
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.code?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const selectedDeptLabel = dept.find((d: any) => d._id === deptFilter)?.name || "All Departments";
  const selectedRoleLabel = role?.data?.find((r) => r._id === roleFilter)?.name || "All Roles";

  const fetchRole = async () => {
    try {
      const res = await getRole();
      setRole(res);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(err?.response?.data);
      }
    }
  };

  // Click-Away Dropdown Close Listener Hook
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(event.target as Node)) {
        setIsDeptDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchRole();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 max-w-8xl mx-auto md:p-6 bg-slate-50/50 min-h-screen font-sansant">

      {/* LEFT CONTENT BLOCK */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80 transition-all duration-300">

          {/* CONTROL HEADER LAYER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-slate-100 gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Users size={22} className="text-teal-500" />
                Team Roster
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Manage and view company seat assignments</p>
            </div>

            {isAdmin && (
              <div className="flex flex-wrap gap-2.5 w-full sm:w-auto items-center">

                {/* 🛡️ CUSTOM ROLE DROPDOWN */}
                <div className="relative" ref={roleDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    className="text-xs border border-slate-200 rounded-xl px-3.5 py-2 flex items-center justify-between gap-2.5 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800 min-w-[130px] shadow-sm transition-all cursor-pointer outline-none focus:ring-4 focus:ring-teal-500/5 font-semibold"
                  >
                    <span className="truncate max-w-[100px]">{selectedRoleLabel}</span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isRoleDropdownOpen ? "rotate-180 text-teal-500" : ""}`} />
                  </button>

                  {isRoleDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-150 rounded-xl shadow-xl z-50 p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
                      <button
                        type="button"
                        onClick={() => { setRoleFilter("all"); setIsRoleDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${roleFilter === "all" ? "bg-teal-50 text-teal-600" : "text-slate-600 hover:bg-slate-50"}`}
                      >
                        All Roles
                      </button>
                      {role?.data?.map((r) => (
                        <button
                          key={r._id}
                          type="button"
                          onClick={() => { setRoleFilter(r._id); setIsRoleDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors truncate ${roleFilter === r._id ? "bg-teal-50 text-teal-600 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                          {r.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 🏢 CUSTOM DEPARTMENT DROPDOWN */}
                <div className="relative" ref={deptDropdownRef}>
                  <button
                    type="button"
                    onClick={() => { setIsDeptDropdownOpen(!isDeptDropdownOpen); setSearch(""); }}
                    className="text-xs border border-slate-200 rounded-xl px-3.5 py-2 flex items-center justify-between gap-2.5 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-800 min-w-[150px] shadow-sm transition-all cursor-pointer outline-none focus:ring-4 focus:ring-teal-500/5 font-semibold"
                  >
                    <span className="truncate max-w-[120px]">{selectedDeptLabel}</span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isDeptDropdownOpen ? "rotate-180 text-teal-500" : ""}`} />
                  </button>

                  {isDeptDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                        <input
                          type="text"
                          placeholder="Search departments..."
                          value={search}
                          autoFocus
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 bg-slate-50 rounded-lg outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 transition-all"
                        />
                      </div>

                      <div className="max-h-48 overflow-y-auto pr-1 text-xs space-y-0.5">
                        <button
                          type="button"
                          onClick={() => { setDeptFilter("all"); setIsDeptDropdownOpen(false); }}
                          className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors ${deptFilter === "all" ? "bg-teal-50 text-teal-600" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                          All Departments
                        </button>

                        {filteredDepartments.length > 0 ? (
                          filteredDepartments.map((d: any) => (
                            <button
                              key={d._id}
                              type="button"
                              onClick={() => { setDeptFilter(d._id); setIsDeptDropdownOpen(false); }}
                              className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors truncate block ${deptFilter === d._id ? "bg-teal-50 text-teal-600 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
                            >
                              {d.name} {d.code ? `[${d.code}]` : ""}
                            </button>
                          ))
                        ) : (
                          <div className="p-3 text-center text-slate-400 italic text-[11px]">
                            No results match string input.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* MAIN ROSTER LIST LAYOUT BOX */}
          <div className="space-y-4">

            {/* 🔍 Search Input Container Box */}
            <div className="w-full max-w-xl mb-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search size={18} className={`transition-colors duration-200 ${searchQuery ? "text-teal-500" : "text-slate-400 group-focus-within:text-teal-500"}`} />
                </div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find team members by name, email or department..."
                  className="w-full pl-11 pr-12 py-2.5 bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 text-slate-800 placeholder-slate-400 text-sm rounded-xl outline-none focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 shadow-inner transition-all duration-200 font-medium"
                />

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-all cursor-pointer"
                    >
                      <X size={14} strokeWidth={2.5} />
                    </button>
                  ) : (
                    <div className="p-1.5 text-slate-300 pointer-events-none">
                      <SlidersHorizontal size={14} />
                    </div>
                  )}
                </div>
              </div>

              {searchQuery !== debouncedSearch && (
                <p className="text-[10px] text-teal-600 font-bold tracking-wide animate-pulse mt-1.5 pl-3">
                  Typing... updating query indices
                </p>
              )}
            </div>

            {/* 🎯 Scrollable List View Track Wrapper */}
            <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent hover:scrollbar-thumb-slate-300 transition-colors">
              {filteredMembers && filteredMembers.length > 0 ? (
                filteredMembers.map((member: any) => (
                  <div
                    key={member._id}
                    className="group flex items-center justify-between p-4 bg-slate-50/40 hover:bg-white transition-all duration-200 rounded-xl border border-slate-100 hover:border-teal-500/20 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">

                      {/* Avatar Grid Block */}
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-400 via-teal-500 to-cyan-600 flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:scale-105 transition-transform duration-200 shrink-0">
                        {member.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "U"}
                      </div>

                      <div className="min-w-0">
                        <div className="text-slate-800 font-bold text-sm truncate group-hover:text-teal-600 transition-colors">
                          {member.name}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap font-medium">
                          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-bold text-[10px] tracking-wide border border-slate-200/50">
                            {member.roles?.name || "No Role"}
                          </span>
                          <span className="text-slate-300 font-normal">•</span>
                          <span className="truncate text-slate-500 font-semibold">{member.department?.name || "Unassigned"}</span>
                          <span className="text-slate-300 font-normal">•</span>
                          <span className="capitalize text-slate-400 font-normal">{member.userType || "Staff"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Context Meta Column Row */}
                    <div className="flex items-center gap-5 shrink-0">
                      <div className="text-right hidden sm:block min-w-0">
                        <div className="text-xs font-bold text-slate-600 truncate max-w-[170px]">
                          {member.email}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                          Joined {member.createdAt ? new Date(member.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "N/A"}
                        </div>
                      </div>

                      {/* Translucent Glassmorphism pill tag states */}
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider shadow-sm border ${member.userType === "admin"
                          ? "bg-purple-50/60 border-purple-100 text-purple-600"
                          : "bg-teal-50/60 border-teal-100 text-teal-600"
                          }`}
                      >
                        {member.userType === "admin" ? "Admin" : "Active"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                /* Empty Dataset Layout Overlay Case Block */
                <div className="text-center py-16 bg-slate-50/30 rounded-2xl border-2 border-dashed border-slate-200/80 max-w-sm mx-auto my-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400 shadow-inner">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-slate-700 font-bold text-sm">No Results Found</h3>
                  <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto px-6 font-medium">
                    We couldn't find any team entries matching your filter requirements.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR PANEL (STATS CARDS GRID Layout) */}
      <div className="space-y-4 lg:sticky lg:top-6 h-fit">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100/80">
          <h3 className="font-bold text-slate-800 text-sm tracking-tight mb-4 flex items-center gap-2">
            <Building2 size={16} className="text-slate-500" />
            Workspace Insights
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {/* Stat Node card 1 */}
            <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600"><UserCheck size={15} /></div>
                <span className="text-xs text-slate-500 font-bold">Filtered Context</span>
              </div>
              <span className="text-base font-extrabold text-slate-800">{filteredMembers?.length || 0}</span>
            </div>

            {/* Stat Node card 2 */}
            <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600"><Briefcase size={15} /></div>
                <span className="text-xs text-slate-500 font-bold">Current Target Range</span>
              </div>
              <span className="text-xs font-bold text-slate-400 italic">Active Range</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}