import { Building2, FileText, Fingerprint, X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDeptMutations } from "../hooks/useDepartmentMutation";

interface CreateDeptModalProps {
    onClose: () => void;
}

export function CreeateDepartmentModal({ onClose }: CreateDeptModalProps) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");

    const {createDepartment, isCreating } = useDeptMutations();

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Department name is required");
        }

        try {
           await createDepartment({ name, description, code });
           onClose();
        } catch (error) {
           console.error(error); 
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4
         backdrop-blur-sm animate-fade-in"> 
         <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl border border-gray-100
         transform transition-all">

             {/* Modal Header */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Building2 className="text-[#14b8a6]" size={20} />
                        Create Department
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-xl 
                        transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

              {/* Data Input Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Department Name */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase
                        tracking-wider mb-1.5 flex items-center gap-1">
                            <Building2 size={12} /> Name
                        </label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => 
                                setName(e.target.value)}
                            placeholder="e.g., Engineering, Human Resources"
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                            focus:outline-none focus:ring-2 focus:ring-[#14b8a6] 
                            focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Department Code (Optional/Helpful Field) */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase 
                        tracking-wider mb-1.5 flex items-center gap-1">
                            <Fingerprint size={12} /> Code (Short Name)
                        </label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => 
                                setCode(e.target.value)}
                            placeholder="e.g., ENG, HR, MKT"
                            maxLength={10}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm 
                            uppercase focus:outline-none focus:ring-2 focus:ring-[#14b8a6] 
                            focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Description Paragraph */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase 
                        tracking-wider mb-1.5 flex items-center gap-1">
                            <FileText size={12} /> Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Briefly summarize operations handled by this team..."
                            rows={3}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm 
                            focus:outline-none focus:ring-2 focus:ring-[#14b8a6] 
                            focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {/* Submit Action Buttons Row */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-50 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 
                            hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="px-4 py-2 text-sm font-semibold bg-[#14b8a6] 
                            hover:bg-[#14b8a6]/90 text-white rounded-xl shadow-sm 
                            transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {isCreating ? "Creating..." : "Save Department"}
                        </button>
                    </div>
                </form>
         </div>

        </div>
    )
}
