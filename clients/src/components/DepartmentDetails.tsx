import { useState } from "react";
import {
    Building2, X, ShieldCheck, Mail, Users, FileText,
    Fingerprint, Calendar, Settings2, UserPlus, UserMinus, Crown
} from "lucide-react";
import { useDeptMutations } from "../hooks/useDepartmentMutation";
import { useUser, user_member_head } from "../hooks/useUser";
import { LoadingSpinner } from "./LoadingSpinner";

interface DeptDetailsProps {
    onClose: () => void;
    data: any; // Current department data object passed from parent grid
    allAvailableUsers?: any[]; // Optional array of all corporate users from your system
}

export function DepartmentDetails({ onClose, data }: DeptDetailsProps) {
    const [activeTab, setActiveTab] = useState<"view" | "manage">("view");
    const [userSearchTerm, setUserSearchTerm] = useState("");
    const { deleteDept } = useDeptMutations();

    // const filter = {};
    // const { data: response } = useUser(filter);


    // console.log("data: ", data.manager);
    const { data: usr_mem_head, isLoading } = user_member_head(data._id, data.code)
    // console.log("use_memeber_head", usr_mem_head?.data?.headInDept.name);

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-3">
                    <LoadingSpinner />
                    <p className="text-sm text-gray-500 font-medium">Loading user rosters...</p>
                </div>
            </div>
        );
    }

    const allAvailableUsers = [
        ...(usr_mem_head?.data?.users || []),
        ...(usr_mem_head?.data.memberInDept || [])
    ]

    const creationDate = data.createdAt
        ? new Date(data.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "N/A";

    // Helper: Verify if a specific user is currently in this department's roster list array
    const isUserAssigned = (userId: string) => {
        return data.users?.some((u: any) => u._id === userId) || false;
    };

    // 👑 Event Handler: Set Head of Department (Manager)
    const handleSetHead = async (managerId: string) => {
        try {
            await updateHead({
                deptId: data._id,
                managerId: managerId === "vacant" ? null : managerId
            });
        } catch (err) {
            console.error("Failed to reassign supervisor:", err);
        }
    };

    // 👥 Event Handler: Assign / Unassign a team member
    const handleToggleMember = async (userId: string, currentStatus: boolean) => {
        try {
            await toggleUserAssignment({
                deptId: data._id,
                userId,
                action: currentStatus ? "unassign" : "assign"
            });
        } catch (err) {
            console.error("Roster operation tracking failure:", err);
        }
    };

    // Filter all system users based on search string criteria
    const filteredUsers = allAvailableUsers?.filter(user =>
        user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
    );

    // Delete an department
    const handleDelDept = () => {
        deleteDept(data._id);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden max-h-[90vh]">

                {/* Modal Header Panel Layout */}
                <div className="flex justify-between items-center bg-slate-50 border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-teal-50 p-2 rounded-xl text-[#14b8a6]">
                            <Building2 size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">{data.name}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">ID: {data.code || "No Code Provided"}</p>
                        </div>
                    </div>

                    {/* View/Manage Mode Switch Toggles */}
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-0.5 rounded-xl flex gap-1 border">
                            <button
                                onClick={() => setActiveTab("view")}
                                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${activeTab === "view" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab("manage")}
                                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${activeTab === "manage" ? "bg-white text-[#14b8a6] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <Settings2 size={12} /> Manage Roster
                            </button>
                        </div>
                        <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 rounded-xl transition-all cursor-pointer">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* TAB WINDOW A: Read-Only Overview Display Panel */}
                {activeTab === "view" && (
                    <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-5 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Meta Information</span>
                            <div className="bg-slate-50 border border-gray-200/60 rounded-xl p-3.5 flex items-center gap-3">
                                <Fingerprint size={18} className="text-gray-400 shrink-0" />
                                <div className="min-w-0">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wide">Identifier Code</span>
                                    <span className="text-sm font-bold text-gray-800 uppercase tracking-wider bg-white border px-2 py-0.5 rounded-md inline-block mt-0.5">{data.code || "NONE"}</span>
                                </div>
                            </div>
                            <div className="bg-slate-50 border border-gray-200/60 rounded-xl p-3.5 flex items-start gap-3">
                                <ShieldCheck size={18} className="text-[#14b8a6] shrink-0 mt-0.5" />
                                <div className="min-w-0 text-xs">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wide">Department Head</span>
                                    {usr_mem_head?.data?.headInDept?.name ? (
                                        <div className="mt-0.5">
                                            <p className="text-sm font-bold text-gray-800 truncate">{usr_mem_head?.data?.headInDept.name}</p>
                                            <p className="text-gray-500 flex items-center gap-1 mt-0.5 truncate"><Mail size={12} className="text-gray-400" /> {data.manager.email}</p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 italic font-medium mt-0.5">Position Vacant</p>
                                    )}
                                </div>
                            </div>
                            <div className="bg-slate-50 border border-gray-200/60 rounded-xl p-3.5 flex items-center gap-3">
                                <Calendar size={18} className="text-gray-400 shrink-0" />
                                <div className="min-w-0">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wide">Provisioned On</span>
                                    <span className="text-xs font-semibold text-gray-700 block mt-0.5">{creationDate}</span>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-3 space-y-5 flex flex-col">
                            <div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-2"><FileText size={13} /> Summary Profile</span>
                                <div className="bg-slate-50 rounded-xl p-4 border border-gray-100">
                                    <p className="text-sm text-gray-600 leading-relaxed italic">"{data.description || "No customized operation profiles have been populated for this system sector yet."}"</p>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col min-h-[180px]">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><Users size={13} /> Active Roster</span>
                                    <span className="text-[10px] bg-teal-50 border border-teal-100 text-[#14b8a6] font-bold px-2 py-0.5 rounded-full">{data.users?.length || 0} Members</span>
                                </div>
                                <div className="border border-gray-100 rounded-xl flex-1 overflow-y-auto max-h-[220px] bg-white divide-y divide-gray-50 p-1">
                                    {data.users && data.users.length > 0 ? (
                                        data.users.map((user: any) => (
                                            <div key={user._id} className="p-2.5 flex items-center justify-between hover:bg-slate-50 rounded-lg">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                                                </div>
                                                <span className="text-[10px] bg-gray-100 text-gray-500 font-medium px-2 py-0.5 rounded">Active</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 gap-1.5"><Users size={24} className="text-gray-300" /><p className="text-xs font-medium">No team members assigned.</p></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB WINDOW B: Active Roster & Head Assignment Administration Engine */}
                {activeTab === "manage" && (
                    <div className="p-6 overflow-y-auto space-y-6 max-h-[70vh]">

                        {/* SECTION 1: Assign Department Head Dropdown */}
                        <div className="bg-slate-50 border rounded-2xl p-4">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                                <Crown size={14} className="text-amber-500" /> Department Manager / Head
                            </label>
                            <div className="flex items-center gap-4 mt-2">
                                <select
                                    value={data.manager?._id || "vacant"}
                                    disabled={isUpdatingHead}
                                    onChange={(e) => handleSetHead(e.target.value)}
                                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-[#14b8a6] outline-none transition-all disabled:opacity-50"
                                >
                                    <option value="vacant">-- Mark Position as Vacant --</option>

                                    {/* Map out current members as selection possibilities for manager roles */}
                                    {data.users?.map((member: any) => (
                                        <option key={member._id} value={member._id}>
                                            {member.name} ({member.email})
                                        </option>
                                    ))}
                                </select>
                                {isUpdatingHead && <span className="text-xs text-[#14b8a6] animate-pulse font-medium">Updating...</span>}
                            </div>
                            <p className="text-[11px] text-gray-400 mt-2">Only users currently assigned to this department's roster list can be designated as the managing supervisor head.</p>
                        </div>

                        {/* SECTION 2: Roster Member Assignment Interactive List Mapping */}
                        <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <Users size={14} /> Assign & Remove Team Members
                                </label>

                                {/* Inner Search Filters inside Management Drawer */}
                                <input
                                    type="text"
                                    value={userSearchTerm}
                                    placeholder="Filter corporate user list..."
                                    onChange={(e) => setUserSearchTerm(e.target.value)}
                                    className="border border-gray-200 bg-slate-50 rounded-xl px-3 py-1 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-[#14b8a6] w-full sm:w-48 transition-all"
                                />
                            </div>

                            <div className="border border-gray-200 rounded-xl bg-white divide-y max-h-[250px] overflow-y-auto p-1 shadow-inner">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user: any) => {
                                        const assigned = isUserAssigned(user._id);
                                        return (
                                            <div key={user._id} className="p-3 flex items-center justify-between hover:bg-slate-50 rounded-lg transition-colors">
                                                <div className="min-w-0 pr-3">
                                                    <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                                </div>
                                                <div className="min-w-0 pr-3">

                                                    <p className="text-xs text-gray-400 truncate">{user.userType}</p>
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={isUpdatingRoster}
                                                    onClick={() => handleToggleMember(user._id, assigned)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer border ${assigned
                                                        ? "bg-red-50 hover:bg-red-100 text-red-600 border-red-100"
                                                        : "bg-teal-50 hover:bg-teal-100 text-[#14b8a6] border-teal-100"
                                                        }`}
                                                >
                                                    {assigned ? (
                                                        <>
                                                            <UserMinus size={13} /> Remove
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserPlus size={13} /> Assign Member
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-8 text-center text-xs text-gray-400 italic">
                                        No team members match this search entry. Ensure 'allAvailableUsers' is loaded.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Actions Footer Panel */}
                <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-semibold bg-gray-200 hover:bg-gray-300/80 text-gray-700 rounded-xl transition-all cursor-pointer"
                    >
                        Done Managing
                    </button>
                    <button
                        type="button"
                        onClick={handleDelDept}
                        className="px-5 py-2 text-sm font-semibold bg-gray-200 hover:bg-gray-300/80 text-red-500 rounded-xl transition-all cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}