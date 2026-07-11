import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { getRole, type RoleResponse } from "../api/roleApi";
import { useDept } from "../hooks/useDepartment";
import { ChevronDown, Search } from "lucide-react"; // 📥 Helpful icons for clean custom dropdown styling
import { useUserNormal } from "../hooks/useUser";
import type { Employee } from "../api/userApi";

export function TeamOverview({ users }: { users: Employee[] }) {
  const [roleFilter, setRoleFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<RoleResponse | null>(null);
  
  // ⚡ NEW: Toggle and layout references for the custom search dropdown container panel
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.userType === "admin";

  // Filter Members matching selection criteria
  const filteredMembers = users?.filter((user: any) => {
    const matchesRole = roleFilter === "all" || user.roles?._id === roleFilter;
    const matchesDept = deptFilter === "all" || user.department?._id === deptFilter;
    return matchesRole && matchesDept;
  });


  const { data: response } = useDept({
    search: undefined,
    limit: 100
  });

  const dept = response?.data?.data || [];

  // 🔍 2. Filter logic for the custom dropdown list based on search characters typed
  const filteredDepartments = dept.filter((d: any) => {
    if (!search.trim()) return true;
    return (
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.code?.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Find active label name string to show on the button cap
  const selectedDeptLabel = dept.find((d: any) => d._id === deptFilter)?.name || "All Depts";

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

  // Close dropdown menu automatically if user clicks completely outside of the panel boundary
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
            
            {isAdmin && (
              <div className="flex gap-2 w-full sm:w-auto items-center">
                {/* Standard Role Select Dropdown */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#14b8a6]/20 bg-white cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  {role?.data?.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>

                {/* 🛠️ CUSTOM SEARCHABLE DEPARTMENT DROPDOWN ENGINE */}
                <div className="relative" ref={dropdownRef}>
                  {/* Trigger Button Mocking Select Field Appearance */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsDeptDropdownOpen(!isDeptDropdownOpen);
                      setSearch(""); // Reset text query whenever popup state toggles open
                    }}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1 flex items-center justify-between gap-2 bg-white text-gray-700 hover:border-gray-300 min-w-[140px] shadow-sm cursor-pointer outline-none focus:ring-2 focus:ring-[#14b8a6]/20"
                  >
                    <span className="truncate max-w-[150px] font-medium">{selectedDeptLabel}</span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isDeptDropdownOpen ? "rotate-180 text-[#14b8a6]" : ""}`} />
                  </button>

                  {/* Absolute Floating Context Overlay Panel Option Cards Board */}
                  {isDeptDropdownOpen && (
                    <div className="absolute right-0 mt-1.5 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-2 space-y-2 animate-fade-in">
                      {/* Search Input Box Frame Context Layer */}
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                        <input
                          type="text"
                          placeholder="Search department list..."
                          value={search}
                          autoFocus // Autofocus instantly focuses keyboard inputs when dropdown opens
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full pl-7 pr-2 py-1 text-xs border border-gray-200 bg-slate-50 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-[#14b8a6]/20"
                        />
                      </div>

                      {/* Dropdown Options List Container wrapper */}
                      <div className="max-h-48 overflow-y-auto divide-y divide-gray-50 text-xs">
                        {/* Default Static 'All' option node row */}
                        <button
                          type="button"
                          onClick={() => {
                            setDeptFilter("all");
                            setIsDeptDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors ${deptFilter === "all" ? "bg-teal-50 text-[#14b8a6] font-bold" : "text-gray-600 hover:bg-slate-50"}`}
                        >
                          All Depts
                        </button>

                        {/* Mapped Computed Node Cards loop output */}
                        {filteredDepartments.length > 0 ? (
                          filteredDepartments.map((d: any) => (
                            <button
                              key={d._id}
                              type="button"
                              onClick={() => {
                                setDeptFilter(d._id);
                                setIsDeptDropdownOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors truncate block ${deptFilter === d._id ? "bg-teal-50 text-[#14b8a6] font-bold" : "text-gray-600 hover:bg-slate-50"}`}
                            >
                              {d.name} {d.code ? `[${d.code}]` : ""}
                            </button>
                          ))
                        ) : (
                          <div className="p-3 text-center text-gray-400 italic text-[11px]">
                            No departments match search entries.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Members Mapping Grid Roster Frame */}
          <div className="space-y-4">
            {filteredMembers && filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg border border-transparent hover:border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      {member.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="text-gray-900 font-medium">{member.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="capitalize">{member.roles?.name || "No Role"}</span>
                        <span>•</span>
                        <span className="capitalize">{member.department?.name || "Unassigned"}</span>
                        <span>•</span>
                        <span className="capitalize">{member.userType || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-medium text-gray-900">{member.email}</div>
                      <div className="text-xs text-gray-500">
                        Joined {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "N/A"}
                      </div>
                    </div>

                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        member.role === "org_admin" ? "bg-purple-100 text-purple-700" : "bg-teal-100 text-teal-700"
                      }`}
                    >
                      {member.userType === "admin" ? "Admin" : "Active"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                No team members found matching your filters.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar Stats Container Box Panel */}
      <div className="hidden lg:block bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-fit">
        <h3 className="font-bold text-gray-900 mb-4">Department Stats</h3>
        <p className="text-sm text-gray-600">
          Showing {filteredMembers?.length || 0} active users based on filters.
        </p>
      </div>
    </div>
  );
}
