import { X } from "lucide-react";
import { useState, useRef, type ChangeEvent } from "react";
import { createPermission, editPermission } from "../api/permissionApi";
import type { Permission } from "./types/rolesType";
import toast from "react-hot-toast";
import axios from "axios";

export function CreatePermission({ onClose }) {
    const [permissionForm, setPermissionForm] = useState<Permission>({
        name: "",
        desc: "",
    });

    const [permLoading, setPermLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const nameInputRef = useRef(null);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setPermissionForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmitPermission = async (e: React.FormEvent) => {
        if (!permissionForm.name) {
            return;
        }
        e.preventDefault();
        setPermLoading(true);

        try {
            if (editingId) {
                const { data } = await editPermission(
                    editingId,
                    permissionForm,
                );
                toast.success(
                    data?.message || "Permission updated successfully!",
                );
                setEditingId(null);
            } else {
                const { data } = await createPermission(permissionForm);
                toast.success(data.message);
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const backendMessage =
                    err.response?.data?.message ||
                    "An unexpected system error occurred.";
                console.error("Error:", backendMessage);
            } else {
                console.error("Unkown Error");
            }
        } finally {
            setPermissionForm({ name: "", desc: "" });
            setPermLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setPermissionForm({ name: "", desc: "" });
    };

    return (
        <div className="fixed bg-green insert-0 z-50 items-center justify-center  p-4">
            <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm h-fit  ">
                <div className="flex justify-between">
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">
                        Create New Permission
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                    Define a new system boundary access level group.
                </p>

                {/* Mock Input Form fields for nice UI context */}
                <div className="space-y-4 ">
                    <div>
                        <label className=" block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                            Permission Name
                        </label>
                        <input
                            type="text"
                            ref={nameInputRef}
                            name="name"
                            value={permissionForm.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g., CREATE_TASK"
                            className="w-full mb-2 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors"
                        />
                        <textarea
                            name="desc" // No type="text" attribute needed for textareas
                            value={permissionForm.desc}
                            onChange={handleChange}
                            placeholder="Enter desc.."
                            rows={3} // Pro tip: specifies the initial visible height lines
                            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors resize-none" // Added resize-none
                        />
                    </div>
                    <button
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm py-2.5 px-4 rounded-lg shadow transition-colors duration-150"
                        disabled={permLoading}
                        onClick={handleSubmitPermission}
                    >
                        {/*{permLoading ? "creating..." : "Generate Role Permission"}*/}
                        {permLoading
                            ? editingId
                                ? "Saving..."
                                : "Creating..."
                            : editingId
                              ? "Update Permission Config"
                              : "Generate Role Permission"}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="w-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium text-sm py-2 px-4 rounded-lg shadow-sm transition-colors"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </section>
        </div>
    );
}
