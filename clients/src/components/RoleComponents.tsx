import { useState } from "react";
import { PencilIcon, Plus, X } from "lucide-react";

import { useRolesMutations } from "../hooks/useRoleMutation";
import { usePermissionMutations } from "../hooks/usePermissionMutation";
import { UseGetPermission } from "../hooks/usePermission";

import { AssignUserRole } from "./AssingUserRole";
import type { Permission, Role, RoleForm } from "./types/rolesType";
import axios from "axios";
import { CreatePermission } from "./CreatePermission";
import { CreateRoles } from "./CreateRoles";
import { UseGetRole } from "../hooks/useRole";

export function RoleComponents() {
    // const [permission, setPermission] = useState<Permission[]>([]);
    // const [loading, setLoading] = useState(true);
    const [, setPermissionForm] = useState<Permission>({
        name: "",
        desc: "",
    });
    const [, setCurrentRole] = useState<string[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [roleEditingId, setRoleEditingId] = useState<string | null>(null);
    // const [roles, setRoles] = useState<Role[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalRoleOpen, setIsModalRoleOpen] = useState(false);

    const [, setRole] = useState<RoleForm>({
        roleName: "",
        permissionId: [],
    });

    const { data: fetchRole } = UseGetRole();
    const { data: fetchPermissions, isLoading: loading } = UseGetPermission()
    const { deleteRoles } = useRolesMutations();
    const { deletePermission } = usePermissionMutations();
    const roles = fetchRole?.data || []
    const permission = fetchPermissions?.data?.data?.data || [];

    const handleRemove = async (id: string) => {
        try {
            await deletePermission(id);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.error(err?.response?.data);
            } else {
                console.error("Unkown Error");
            }
        }
    };

    // 3. Setup input populations and programmatically force cursor focus
    const startEditMode = (perm: Permission) => {
        if (perm._id) {
            setEditingId(perm._id);
        }
        setPermissionForm({
            name: perm.name,
            desc: perm.desc || "",
        });
        // Timeout guarantees input rendering cycles complete before executing focus call
    };

    const startRoleEditMode = (role: Role) => {
        const ids = role.permission.map((p) => p._id);
        // setCurrentRole([...ids]);
        setCurrentRole(ids.filter(Boolean) as string[]);
        setRoleEditingId(role._id);
        setRole({
            roleName: role.name,
            // permissionId: [...ids],
            permissionId: ids.filter((id): id is string => id !== undefined),
        });
    };

    const handleRemoveRole = async (id: string) => {
        try {
            await deleteRoles(id);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.error(err?.response?.data);
            } else {
                console.error("Unknown Error");
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
            {/* Top Header Bar */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    Access Management
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                    Manage dynamic app roles and permission levels.
                </p>
            </header>

            {isModalOpen && (
                <CreatePermission onClose={() => setIsModalOpen(false)} />
            )}

            {/* Main Workspace Grid */}
            <main className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-5  ">
                {/* Left Column: Create Management Action Panel */}
                <section className="flex items-center justify-center min-h-[100px] w-full">
                    <button
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                        className="flex w-[85%] hover:w-full justify-center text-center items-center gap-1.5 px-10 py-4 bg-[#14b8a6] hover:bg-[#14b8a6]/90 text-white rounded-lg text-xl font-medium transition-all duration-300 ease-in-out shadow-sm cursor-pointer whitespace-nowrap hover:font-semibold"
                    >
                        <Plus size={25} /> Add Permission
                    </button>
                </section>
                <section className="flex items-center justify-center min-h[100px]">
                    <button
                        onClick={() => {
                            setIsModalRoleOpen(true);
                        }}
                        className="flex w-[85%] hover:w-full justify-center text-center items-center gap-1.5 px-10 py-4 bg-[#14b8a6] hover:bg-[#14b8a6]/90 text-white rounded-lg text-xl font-medium transition-all duration-300 ease-in-out shadow-sm cursor-pointer whitespace-nowrap hover:font-semibold"
                    >
                        <Plus size={25} /> Add Roles
                    </button>
                </section>

                {isModalRoleOpen && (
                    <CreateRoles onClose={() => setIsModalRoleOpen(false)} />
                )}

                {/* Right Column: Database Dynamic Permission Target Feed */}
                <section className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Available Permissions
                            </h2>
                            <p className="text-xs text-slate-500">
                                Live dynamic string definitions compiled from
                                MongoDB.
                            </p>
                        </div>
                        <span className="text-xs font-medium bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full border border-indigo-100">
                            {permission.length} Total
                        </span>
                    </div>

                    {/* Conditional Loading States / Empty Fallback Boundary */}
                    {loading ? (
                        <div className="p-8 text-center text-sm text-slate-400 animate-pulse">
                            Retrieving schema parameters...
                        </div>
                    ) : permission.length === 0 ? (
                        <div className="p-8 text-center text-sm text-slate-400">
                            No custom string keys populated yet. Create your
                            first baseline permission.
                        </div>
                    ) : (
                        <div>
                            <ul className="divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
                                {permission.map((perm) => (
                                    <li
                                        key={perm._id}
                                        className="p-5 hover:bg-slate-50/70 transition-colors flex items-start gap-4"
                                    >
                                        {/* Visual Status Indicator Node */}
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-sm shadow-emerald-500/40" />

                                        <div className="space-y-1 w-full flex justify-between">
                                            <div>
                                                {/* Permission Code Key Badge Style */}
                                                <span className="inline-block font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 tracking-wide uppercase">
                                                    {perm.name}
                                                </span>
                                                {/* Description Text */}
                                                <p className="text-sm text-slate-600 leading-relaxed pt-0.5">
                                                    {perm.desc || (
                                                        <span className="italic text-slate-400">
                                                            No descriptive brief
                                                            provided.
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="space-x-2 flex">
                                                <div
                                                    className="text-red-900 hover:text-white hover:bg-red-500 h-8 p-1 hover:rounded"
                                                    onClick={() =>
                                                        handleRemove(
                                                            perm._id ?? "",
                                                        )
                                                    }
                                                >
                                                    <p>{<X />} </p>
                                                </div>
                                                <div>
                                                    <button
                                                        // 5. Trigger form load and component input cursor tracking mechanics
                                                        onClick={() =>
                                                            startEditMode(perm)
                                                        }
                                                        className={`p-1.5 rounded transition-colors ${editingId ===
                                                            perm._id
                                                            ? "text-amber-600 bg-amber-50"
                                                            : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                                                            }`}
                                                        title="Edit Permission"
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div>
                                <h2 className="p-4 text-lg font-semibold text-slate-900">
                                    Avalialable Roles </h2>
                                <ul className="divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
                                    {roles.length > 0 && roles?.map((perm) => (
                                        <li
                                            key={perm._id}
                                            className="p-5 hover:bg-slate-50/70 transition-colors flex items-start gap-4"
                                        >
                                            {/* Visual Status Indicator Node */}
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-sm shadow-emerald-500/40" />

                                            <div className="space-y-1 w-full flex justify-between">
                                                <div>
                                                    {/* Permission Code Key Badge Style */}
                                                    <span className="inline-block font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 tracking-wide uppercase">
                                                        {perm.name}
                                                    </span>
                                                    {/* Description Text */}
                                                    <div className="text-sm text-slate-600 leading-relaxed pt-0.5">
                                                        {perm?.permission?.map(
                                                            (p) => (
                                                                <p key={p._id}>
                                                                    {p.name}
                                                                </p>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="space-x-2 flex">
                                                    <div
                                                        className="text-red-900 hover:text-white hover:bg-red-500 h-8 p-1 hover:rounded"
                                                        onClick={() =>
                                                            handleRemoveRole(
                                                                perm._id,
                                                            )
                                                        }
                                                    >
                                                        <p>{<X />} </p>
                                                    </div>
                                                    <div>
                                                        <button
                                                            // 5. Trigger form load and component input cursor tracking mechanics
                                                            onClick={() =>
                                                                startRoleEditMode(
                                                                    perm,
                                                                )
                                                            }
                                                            className={`p-1.5 rounded transition-colors ${roleEditingId ===
                                                                perm._id
                                                                ? "text-amber-600 bg-amber-50"
                                                                : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                                                                }`}
                                                            title="Edit Permission"
                                                        >
                                                            <PencilIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    <AssignUserRole />
                </section>
            </main>
        </div >
    );
}
