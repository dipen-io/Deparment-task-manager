import { X } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { RoleForm } from "./types/rolesType";
import toast from "react-hot-toast";
import {
    updateRoles,
    type UpdateRolePaylaod,
} from "../api/roleApi";
import axios from "axios";
import { UseGetPermission } from "../hooks/usePermission";
import { useRolesMutations } from "../hooks/useRoleMutation";

export function CreateRoles({ onClose }) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [currentRole, setCurrentRole] = useState<string[]>([]);
    const [role, setRole] = useState<RoleForm>({
        roleName: "",
        permissionId: [],
    });
    const [roleEditingId, setRoleEditingId] = useState<string | null>(null);
    // const [roles, setRoles] = useState<Role[]>([]);
    const roleInputRef = useRef(null);

    const { createRoles } = useRolesMutations();

    const handleChangeRole = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRole((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePermissionToggle = (permissionId: string) => {
        setRole((prev) => {
            const current = [...prev.permissionId]; // 👈 CLONE

            const isAlreadySelected = current.includes(permissionId);

            const updated = isAlreadySelected
                ? current.filter((id) => id !== permissionId)
                : [...current, permissionId];

            return {
                ...prev,
                permissionId: updated,
            };
        });
    };

    const handleAddRole = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!role.roleName.trim() || role.permissionId === null) {
            toast.error("All Fileds are required");
            return;
        }
        setIsSubmitting(true);
        try {
            // curentrly not edit option avaiable
            setRoleEditingId(null);
            setCurrentRole(null);
            if (roleEditingId) {
                const current: string[] = role.permissionId;
                const original: string[] = currentRole;
                const toAdd = current.filter((id) => !original.includes(id));
                const toRemove = original.filter((id) => !current.includes(id));
                const permData: UpdateRolePaylaod = { toAdd, toRemove };
                const { data } = await updateRoles(roleEditingId, permData);
                toast.success(data?.message);
            } else {
                await createRoles(role);
            }

            setRole({ roleName: "", permissionId: [] });
            setRole((prev) => ({
                ...prev,
                permissionId: [],
            }));
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.error(err.response?.data);
            } else {
                console.error("Unknown Error");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // ROLE
    const { data: response } = UseGetPermission();
    const permissionsList = response?.data?.data?.data || [];

    useEffect(() => {
        if (roleEditingId && roleInputRef.current) {
            roleInputRef.current.focus();
        }
    }, [roleEditingId]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl">
                <div className="flex justify-between">
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">
                        Create New Role
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

                <div className="space-y-4 ">
                    <div>
                        <label className=" block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                            Role Name
                        </label>
                        <input
                            type="text"
                            ref={roleInputRef}
                            name="roleName"
                            value={role.roleName}
                            required
                            onChange={handleChangeRole}
                            placeholder="e.g., Support Lead"
                            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors"
                        />
                        {/* Render here list of permision as a dropdown*/}
                        {/* 4. Multi-Select Checkbox Container */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 mt-2">
                                Assign System Permissions (
                                {role?.permissionId?.length} Selected)
                            </label>

                            <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                                {permissionsList.map((perm) => {
                                    const isChecked =
                                        role.permissionId?.includes(
                                            perm._id ?? "",
                                        );

                                    return (
                                        <label
                                            key={perm._id}
                                            className={`flex items-start gap-3 p-2 rounded-lg border transition-all cursor-pointer text-sm select-none ${isChecked
                                                ? "bg-indigo-50/60 border-indigo-200 text-indigo-900"
                                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() =>
                                                    handlePermissionToggle(
                                                        perm._id ?? "",
                                                    )
                                                }
                                                className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                            />
                                            <div className="-mt-0.5">
                                                <span className="font-mono text-xs font-bold block">
                                                    {perm.name}
                                                </span>
                                                <span className="text-xs text-slate-400 font-normal">
                                                    {perm.desc}
                                                </span>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <button
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm py-2.5 px-4 rounded-lg shadow transition-colors duration-150"
                        onClick={handleAddRole}
                        disabled={isSubmitting}
                    >
                        {/* TODO incase of update*/}
                        {isSubmitting
                            ? roleEditingId
                                ? "Updating Role"
                                : "Syncing Permission.."
                            : roleEditingId
                                ? "Update Role"
                                : "Generate Role Group"}
                    </button>
                </div>
            </div>
        </div>
    );
}
