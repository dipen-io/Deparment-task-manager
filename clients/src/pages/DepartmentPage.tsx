import { useDept } from "../hooks/useDepartment";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Building2, ShieldAlert, UserCheck, Users, ArrowRight, Plus} from "lucide-react";
import { useState } from "react";
import { CreeateDepartmentModal } from "../components/CreateDeptModal";

export function Department() {

    const [isCreateDeptModelOpen, setIsCreateDeptModalOpen] = useState(false);

    const filters = {}; 
    const { data: response, isLoading, isError } = useDept(filters);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <LoadingSpinner />
                <p className="text-sm text-gray-500 font-medium animate-pulse">Loading departments...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto mt-10 max-w-md p-6 bg-red-50 border border-red-200 rounded-xl text-center shadow-sm">
                <ShieldAlert className="mx-auto text-red-500 mb-3" size={32} />
                <h3 className="text-red-800 font-semibold text-lg">Failed to load data</h3>
                <p className="text-red-600 text-sm mt-1">An unexpected error occurred while fetching department configurations.</p>
            </div>
        );
    }

    const departments = response?.data?.data || [];

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"> 
            {/* Header section with total count badge */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b 
            border-gray-100 pb-5 mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex 
                    items-center gap-2.5">
                        <Building2 className="text-[#14b8a6]" size={26} />
                        Departments
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage corporate organizational units,                         active rosters, and supervisors.</p>
                </div>
                <div className=" space-x-4  flex text-gray-700 text-xs font-semibold px-3 py-1.5
                 self-start sm:self-auto">

                    <div className="bg-gray-200 px-3 py-1.5 text-blue-500
hover:bg-green-300 
                font-semibold
                    ">
                        <button className="font-semibold flex items-center gap-0.5" onClick={ () => 
                           setIsCreateDeptModalOpen(true)}> <Plus size={16} /> Add Dept</button>
                    </div>
                <div className="bg-gray-200 px-3 py-3 hover:bg-green-300 
                font-semibold
                "> 
                    Total count: {departments.length}
                </div>
                </div>

            </div>
            
            {/* Empty State View */}
            {departments.length === 0 ? ( 
                <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed 
                border-gray-200 max-w-xl mx-auto">  
                    <Building2 className="mx-auto text-gray-300 mb-3" size={40} />
                    <h3 className="text-gray-700 font-semibold">No Departments Found</h3>
                    <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">There are currently
                    no active organizational listings configured.</p>
                </div>
            ) : (
                /* Grid Framework Display */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {departments.map((dept) => (
                        <div 
                            key={dept._id} 
                            className="group bg-white border border-gray-200 rounded-2xl p-6 flex
                            flex-col justify-between shadow-sm hover:shadow-md 
                            hover:border-[#14b8a6]/40 transition-all duration-200"
                        > 
                            <div>
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <h3 className="font-bold text-lg text-gray-900 
                                    group-hover:text-[#14b8a6] transition-colors line-clamp-1">
                                        {dept.name}
                                    </h3>
                                    {dept.code && (
                                        <span className="bg-gray-100 text-gray-600 text-[10px] 
                                        uppercase tracking-wider font-bold px-2 py-0.5 rounded">
                                            {dept.code}
                                        </span>
                                    )}
                                </div>
                                
                                <p className="text-gray-500 text-sm leading-relaxed mb-6 
                                line-clamp-3">
                                    {dept.description || "No dynamic summary profile has been defined f                                     or this department unit."}
                                </p>
                            </div>
                            
                            <div className="space-y-4 border-t border-gray-50 pt-4 mt-auto">
                                {/* Supervisor Info Bar */}
                                <div className="flex items-start gap-3 bg-slate-50/70 rounded-xl p-3">
                                    <div className={`p-1.5 rounded-lg shrink-0 ${dept.manager?._id ?
                                        "bg-teal-50 text-[#14b8a6]" : "bg-gray-100 text-gray-400"}`}>
                                        <UserCheck size={16} />
                                    </div>
                                    <div className="text-xs min-w-0">
                                        <span className="text-gray-400 block font-semibold 
                                        uppercase tracking-wider text-[10px] mb-0.5">Manager Profile</span>
                                        {dept.manager?._id ? (
                                            <div>
                                                <p className="text-gray-800 font-semibold truncate">
                                                {dept.manager.name}</p>
                                                <p className="text-gray-500 truncate mt-0.5">
                                                {dept.manager.email}</p>
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 italic font-medium py-0.5">
                                            Vacant Position</p>
                                        )}
                                    </div>
                                </div>

                                {/* Active User Metric Bottom Row */}
                                <div className="flex items-center justify-between text-xs 
                                font-medium text-gray-600 px-1 pt-1">
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <Users size={15} className="text-gray-400" />
                                        <span>Roster Size:</span>
                                        <strong className="text-gray-900 font-semibold">
                                        {dept.users?.length || 0} members</strong>
                                    </div>
                                    <button className="text-gray-400 group-hover:text-[#14b8a6] 
                                    transition-colors flex items-center gap-0.5 font-semibold text-xs 
                                    cursor-pointer">
                                        Details
                                        <ArrowRight size={13} className="transform 
                                        group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div> 
                    ))}
                </div>
            )}

            {/* 🚪 MODAL CONDITIONAL PORTAL MOUNTING GATEWAY CONTAINER */}
            {isCreateDeptModelOpen && (
                <CreeateDepartmentModal onClose={() => setIsCreateDeptModalOpen(false)} />
            )}
        </div>
    );
}
