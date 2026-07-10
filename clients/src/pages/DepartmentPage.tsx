import { useDept } from "../hooks/useDepartment";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Building2, ShieldAlert, UserCheck, Users, ArrowRight, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { CreeateDepartmentModal } from "../components/CreateDeptModal";
import { DepartmentDetails } from "../components/DepartmentDetails";

export function Department() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [limit] = useState(6); // Set your pagination limit per page grid

    const [isCreateDeptModelOpen, setIsCreateDeptModalOpen] = useState(false);
    const [isDeptDetailOpen, setIsDeptDetailOpen] = useState(false);
    const [selectedDeptData, setSelectedDeptData] = useState<any>(null);

    // ⏳ 300ms Search Input Debouncer Effect
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset back to page 1 on active search execution
        }, 300);
        return () => clearTimeout(handler);
    }, [search]);


    const { data: response, isLoading, isError } = useDept({
        search: debouncedSearch || undefined,
        page: page,
        limit: limit
    });
    // Extract elements from nested offset schema
    const nestedPayload = response?.data;
    const departments = nestedPayload?.data || [];
    const hasMore = nestedPayload?.hasMore || false;

    // For getting fresh updated data on DepartmentDetails page
    useEffect(() => {
        if (!selectedDeptData) return;
        const updatedDept = departments.find((dept: any) =>
            dept._id === selectedDeptData._id);
        if (updatedDept) {
            setSelectedDeptData(updatedDept);
        }
    }, [departments, selectedDeptData])

    // Handle Loading State
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                <LoadingSpinner />
                <p className="text-sm text-gray-500 font-medium animate-pulse">Loading departments...</p>
            </div>
        );
    }

    // Handle Error State
    if (isError) {
        return (
            <div className="mx-auto mt-10 max-w-md p-6 bg-red-50 border border-red-200 rounded-xl text-center shadow-sm">
                <ShieldAlert className="mx-auto text-red-500 mb-3" size={32} />
                <h3 className="text-red-800 font-semibold text-lg">Failed to load data</h3>
                <p className="text-red-600 text-sm mt-1">An unexpected error occurred while fetching department configurations.</p>
            </div>
        );
    }



    // 🔀 Page Shifting Event Actions
    const handleNextPage = () => {
        if (hasMore) setPage((prev) => prev + 1);
    };

    const handlePrevPage = () => {
        setPage((prev) => Math.max(prev - 1, 1));
    };


    const handleOpenDetails = (dept: any) => {
        setSelectedDeptData(dept);
        setIsDeptDetailOpen(true);
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

            {/* Top Header Control panel Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-5 mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
                        <Building2 className="text-[#14b8a6]" size={26} />
                        Departments
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Manage corporate organizational units, active rosters, and supervisors.</p>
                </div>

                {/* Controls: Search, Add Button, Total Count Banner */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Polished Search Bar Input Container */}
                    <div className="relative flex-1 sm:w-64 ">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            value={search}
                            placeholder="Search departments..."
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent bg-white transition-all shadow-sm placeholder:text-gray-400 "
                        />
                    </div>

                    {/* Add Dept Trigger Button */}
                    <button
                        onClick={() => setIsCreateDeptModalOpen(true)}
                        className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#14b8a6] hover:bg-[#14b8a6]/90 text-white rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer whitespace-nowrap"
                    >
                        <Plus size={16} /> Add Dept
                    </button>

                    {/* Total Count Display Banner */}
                    <div className="bg-gray-50 border border-gray-200/60 px-4 py-2 text-gray-600 text-xs font-semibold rounded-xl flex items-center justify-center whitespace-nowrap shadow-sm">
                        Total in Page: {departments.length}
                    </div>
                </div>
            </div>

            {/* Main Cards Grid Frame Context Display */}
            {departments.length === 0 ? (
                <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 max-w-xl mx-auto ">
                    <Building2 className="mx-auto text-gray-300 mb-3" size={40} />
                    <h3 className="text-gray-700 font-semibold">No Departments Found</h3>
                    <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">There are currently no active organizational listings matching these filter criteria.</p>
                </div>
            ) : (
                <>
                    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {departments.map((dept) => (
                            <div
                                key={dept._id}
                                className="group bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#14b8a6]/40 transition-all duration-200 hover:bg-slate-200"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#14b8a6] transition-colors line-clamp-1">
                                            {dept.name}
                                        </h3>
                                        {dept.code && (
                                            <span className="bg-gray-100 text-gray-600 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded">
                                                {dept.code}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                        {dept.description || "No dynamic summary profile has been defined for this department unit."}
                                    </p>
                                </div>

                                <div className="space-y-4 border-t border-gray-50 pt-4 mt-auto">
                                    {/* Supervisor Info Bar */}
                                    <div className="flex items-start gap-3 bg-slate-50/70 rounded-xl p-3">
                                        <div className={`p-1.5 rounded-lg shrink-0 ${dept.manager?._id ? "bg-teal-50 text-[#14b8a6]" : "bg-gray-100 text-gray-400"}`}>
                                            <UserCheck size={16} />
                                        </div>
                                        <div className="text-xs min-w-0">
                                            <span className="text-gray-400 block font-semibold 
                                            uppercase tracking-wider text-[10px] mb-0.5">
                                                Manager Profile</span>
                                            {dept.manager?._id ? (
                                                <div>
                                                    <p className="text-gray-800 font-semibold 
                                                    truncate">{dept.manager.name}</p>
                                                    <p className="text-gray-500 truncate mt-0.5">
                                                        {dept.manager.email}</p>
                                                </div>
                                            ) : (
                                                <p className="text-gray-400 italic font-medium 
                                                py-0.5">Vacant Position</p>
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
                                        <button className="text-gray-400 hover:underline
                                        group-hover:text-[#14b8a6] transition-colors flex 
                                        items-center gap-0.5 font-semibold text-xs cursor-pointer"
                                            onClick={() => {
                                                handleOpenDetails(dept)
                                            }}
                                        >
                                            Details
                                            <ArrowRight size={13} className="transform 
                                            group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 🛠️ POLISHED BOTTOM PAGINATION CONTROL PANEL FOOTER */}
                    <div className="mt-10 border-t border-gray-100 pt-6 flex items-center justify-between">
                        <p className="text-sm text-gray-500 font-medium">
                            Viewing page <span className="text-gray-800 font-semibold">{page}</span>
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrevPage}
                                disabled={page === 1}
                                className="flex items-center gap-1 px-3 py-2 border border-gray-200 
                                rounded-xl text-sm font-semibold text-gray-600 bg-white 
                                hover:bg-gray-50 
                                disabled:opacity-40 disabled:hover:bg-white transition-colors 
                                cursor-pointer"
                            >
                                <ChevronLeft size={16} /> Previous
                            </button>
                            <button
                                onClick={handleNextPage}
                                disabled={!hasMore}
                                className="flex items-center gap-1 px-3 py-2 border border-gray-200 
                                rounded-xl text-sm font-semibold text-gray-600 bg-white 
                                hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white 
                                transition-colors cursor-pointer"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* MODAL CONDITIONAL PORTAL MOUNTING GATEWAY CONTAINER */}
            {isCreateDeptModelOpen && (
                <CreeateDepartmentModal onClose={() => setIsCreateDeptModalOpen(false)} />
            )}

            {isDeptDetailOpen && selectedDeptData && (
                <DepartmentDetails onClose={() => setIsDeptDetailOpen(false)} data={selectedDeptData} />
            )}
        </div>
    );
}
