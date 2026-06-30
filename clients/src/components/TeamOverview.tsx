import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getDepartment } from "../api/departmentApi";
import axios from "axios";
import type { DeparmentData } from "../api/departmentApi";
import { getRole, type RoleResponse } from "../api/roleApi";

export function TeamOverview({ users }: { users: any[] }) {
  const [roleFilter, setRoleFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [dept, setDept] = useState<DeparmentData | null>(null);
  const [role, setRole]  = useState<RoleResponse| null>(null);
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.userType === "admin";

  // 1. Filter Logic based on your received data
  const filteredMembers = users?.filter((user) => {
    const matchesRole = roleFilter === "all" || user.roles?._id === roleFilter;
    const matchesDept = deptFilter === "all" || user.department?._id === deptFilter;
    return matchesRole && matchesDept;
  });

  const fetchDepartment = async() => {
      try{
          const res = await getDepartment();
          setDept(res);
      } catch(err: unknown) {
          if(axios.isAxiosError(err)) {
              console.error(err?.response?.data);
          }
      }
  }

  const fetchRole = async() => {
      try{
          const res = await getRole();
          setRole(res);
      } catch(err: unknown) {
          if(axios.isAxiosError(err)) {
              console.error(err?.response?.data);
          }
      }
  }

  useEffect(() => {
      fetchDepartment();
      fetchRole();
  },[])


  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-900">
              Team Members
              {/*{isAdmin ? "System Users" : "My Department Members"}*/}
              {/*</h2>*/}
            </h2>
            {isAdmin && (
              <>
                {/* Filter Controls */}
                <div className="flex gap-2 w-full sm:w-auto">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#14b8a6]/20"
                  >
                    <option value="all">All Roles</option>
                    {
                        role?.data?.map((d) => (
                            <option key={d._id} value={d._id} >
                            {d.name}
                            </option>
                        ))
                    }
                  </select>

                  <select
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#14b8a6]/20"
                  >
                    <option value="all">All Depts</option>
                    {
                        dept?.data?.data?.map((d) => (
                            <option key={d._id} value={d._id} >
                            {d.name}
                            </option>
                        ))
                    }
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            {filteredMembers && filteredMembers?.length > 0 ? (
              filteredMembers.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg border border-transparent hover:border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    {/* Dynamic Initials Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#0d9488] flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      {member.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <div className="text-gray-900 font-medium">
                        {member.name}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="capitalize">
                          {member.roles?.name}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{member.department?.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-medium text-gray-900">
                        {member.email}
                      </div>
                      <div className="text-xs text-gray-500">
                        Joined {new Date(member.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${member.role === "org_admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-teal-100 text-teal-700"
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

      {/* Right Sidebar Placeholder (e.g., Stats or Activity) */}
      <div className="hidden lg:block bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-fit">
        <h3 className="font-bold text-gray-900 mb-4">Department Stats</h3>
        <p className="text-sm text-gray-600">
          Showing {filteredMembers?.length} active users based on filters.
        </p>
      </div>
    </div>
  );
 }


