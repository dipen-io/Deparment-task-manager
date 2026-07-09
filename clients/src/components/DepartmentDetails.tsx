import { Building2, X, ShieldCheck, Mail, Users, FileText, Fingerprint, Calendar } from "lucide-react";
import { useDeptMutations } from "../hooks/useDepartmentMutation";

interface CreateDeptModalProps {
    onClose: () => void;
    data: any;
}

export function DepartmentDetails({ onClose, data }: CreateDeptModalProps) {

    const { deleteDept, isDeleting } = useDeptMutations();

    // Format creation date if it exists in your schema
    const creationDate = data.createdAt
        ? new Date(data.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "N/A";


    const handleDelete = async () => {
        const confirmDelete = window.confirm(`are u want to delete`)

        if (!confirmDelete) return;

        try {
            await deleteDept(data._id);
            onClose();
        } catch (error) {
            console.error("Delete sequence interrupted: ", error);
        }
    }
    return (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-scale-up max-h-[90vh]">

                {/* Modal Header Banner */}
                <div className="flex justify-between items-center bg-slate-50 border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-teal-50 p-2 rounded-xl text-[#14b8a6]">
                            <Building2 size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                {data.name} Profile
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">Comprehensive overview and system roster</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 rounded-xl transition-all cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Content Framework Panel */}
                <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-5 gap-6">

                    {/* Left Column: Core Specifications (Span 2) */}
                    <div className="md:col-span-2 space-y-4">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Meta Information</span>

                        {/* Department Code Badge */}
                        <div className="bg-slate-50 border border-gray-200/60 rounded-xl p-3.5 flex items-center gap-3">
                            <Fingerprint size={18} className="text-gray-400 shrink-0" />
                            <div className="min-w-0">
                                <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wide">Identifier Code</span>
                                <span className="text-sm font-bold text-gray-800 uppercase tracking-wider bg-white border px-2 py-0.5 rounded-md inline-block mt-0.5">
                                    {data.code || "NONE"}
                                </span>
                            </div>
                        </div>

                        {/* Supervisor Management Frame */}
                        <div className="bg-slate-50 border border-gray-200/60 rounded-xl p-3.5 flex items-start gap-3">
                            <ShieldCheck size={18} className="text-[#14b8a6] shrink-0 mt-0.5" />
                            <div className="min-w-0 text-xs">
                                <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wide">Department Supervisor</span>
                                {data.manager?.name ? (
                                    <div className="mt-0.5">
                                        <p className="text-sm font-bold text-gray-800 truncate">{data.manager.name}</p>
                                        <p className="text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                                            <Mail size={12} className="text-gray-400" /> {data.manager.email}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic font-medium mt-0.5">Position Vacant</p>
                                )}
                            </div>
                        </div>

                        {/* Calendar Logs timeline info */}
                        <div className="bg-slate-50 border border-gray-200/60 rounded-xl p-3.5 flex items-center gap-3">
                            <Calendar size={18} className="text-gray-400 shrink-0" />
                            <div className="min-w-0">
                                <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wide">Provisioned On</span>
                                <span className="text-xs font-semibold text-gray-700 block mt-0.5">{creationDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Operational Descriptions & Active Roster (Span 3) */}
                    <div className="md:col-span-3 space-y-5 flex flex-col">
                        {/* Summary Block Description */}
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                                <FileText size={13} /> Summary Profile
                            </span>
                            <div className="bg-slate-50 rounded-xl p-4 border border-gray-100">
                                <p className="text-sm text-gray-600 leading-relaxed italic">
                                    "{data.description || "No customized operation profiles have been populated for this system sector yet."}"
                                </p>
                            </div>
                        </div>

                        {/* Dynamic Active Roster Section */}
                        <div className="flex-1 flex flex-col min-h-[180px]">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                    <Users size={13} /> Active Roster
                                </span>
                                <span className="text-[10px] bg-teal-50 border border-teal-100 text-[#14b8a6] font-bold px-2 py-0.5 rounded-full">
                                    {data.users?.length || 0} Members assigned
                                </span>
                            </div>

                            {/* Roster Users list rendering board map */}
                            <div className="border border-gray-100 rounded-xl flex-1 overflow-y-auto max-h-[220px] bg-white divide-y divide-gray-50 shadow-inner p-1">
                                {data.users && data.users.length > 0 ? (
                                    data.users.map((user: any) => (
                                        <div key={user._id} className="p-2.5 flex items-center justify-between hover:bg-slate-50 rounded-lg transition-colors">
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                                                <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                                            </div>
                                            <span className="text-[10px] bg-gray-100 text-gray-500 font-medium px-2 py-0.5 rounded">
                                                Active
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 gap-1.5">
                                        <Users size={24} className="text-gray-300" />
                                        <p className="text-xs font-medium">No team members assigned to this sector.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Actions Footer Panel */}
                <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200/70 rounded-xl transition-all cursor-pointer"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 text-sm bg-red-200 font-medium text-gray-600 hover:bg-gray-200/70 rounded-xl transition-all cursor-pointer"
                    >
                        {isDeleting ? "Deleting..." : "Delete Department"}
                    </button>
                    <button
                        type="button"
                        onClick={() => alert("Edit modal functionality under hook assembly")}
                        className="px-5 py-2 text-sm font-semibold bg-[#14b8a6] hover:bg-[#14b8a6]/90 text-white rounded-xl shadow-md shadow-teal-600/10 transition-all cursor-pointer"
                    >
                        Edit Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}