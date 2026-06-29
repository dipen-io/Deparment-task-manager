import { useRef, useEffect, useState } from "react";
import {
    getPermission,
    createPermission,
    removePermission,
    editPermission,
} from "../api/permissionApi";
import toast from "react-hot-toast";
import { PencilIcon, X } from "lucide-react";
import { createRole, getRole, updateRoles, deleteRoles } from "../api/roleApi";
import { AssignUserRole } from "./AssingUserRole";

export function RoleComponents() {
    const [permission, setPermission] = useState([]);
    const [loading, setLoading] = useState(true);
    const [permLoading, setPermLoading] = useState(false);
    const [permissionForm, setPermissionForm] = useState({
        name: "",
        desc: "",
    });
    const [correntRole, setCurrentRole] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [roleEditingId, setRoleEditingId] = useState(null);
    const [roles, setRoles] = useState([]);

    const [role, setRole] = useState({ roleName: "", permissionId: [] });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const nameInputRef = useRef(null);
    const roleInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPermissionForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangeRole = (e) => {
        const { name, value } = e.target;
        setRole((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fetchPerm = async () => {
        try {
            setLoading(true);
            const { data } = await getPermission();
            // Fallback to empty array if nested data structure evaluates to undefined
            setPermission(data?.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch permissions:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRole = async () => {
        try {
            setLoading(true);
            const { data } = await getRole();
            // Fallback to empty array if nested data structure evaluates to undefined
            setRoles(data?.data || []);
        } catch (error) {
            console.error("Failed to fetch permissions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPerm();
        fetchRole();
    }, []);

    useEffect(() => {
        if (roleEditingId && roleInputRef.current) {
            roleInputRef.current.focus();
        }
    }, [roleEditingId]);

    const handlePermissionToggle = (permissionId) => {
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

    const permissionsList = permission;

    const handleSubmitPermission = async (e) => {
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
            fetchPerm();
        } catch (err) {
            const backendMessage =
                err.response?.data?.message ||
                "An unexpected system error occurred.";
            console.error("Error:", backendMessage);
        } finally {
            setPermissionForm({ name: "", desc: "" });
            setPermLoading(false);
        }
    };

    const handleRemove = async (id: string) => {
        try {
            const { data } = await removePermission(id);
            toast.success(data.message);
            fetchPerm();
        } catch (err) {
            console.error("Error: ", err.response);
        }
    };

    // 3. Setup input populations and programmatically force cursor focus
    const startEditMode = (perm) => {
        setEditingId(perm._id);
        setPermissionForm({
            name: perm.name,
            desc: perm.desc || "",
        });

        // Timeout guarantees input rendering cycles complete before executing focus call
        setTimeout(() => {
            nameInputRef.current?.focus();
        }, 10);
    };

    const startRoleEditMode = (role) => {
        console.log("ROLE", role);
        const ids = role.permission.map((p) => p._id);
        setCurrentRole([...ids]);
        setRoleEditingId(role._id);
        setRole({
            roleName: role.name,
            permissionId: [...ids],
        });
        console.log("ROLE2", role);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setPermissionForm({ name: "", desc: "" });
    };

    const handleRoleCancelEdit = () => {
        setRoleEditingId(null);
        setRole({ roleName: "", permissionId: [] });
    };

    const handleAddRole = async (e) => {
        e.preventDefault();
        if (!role.roleName.trim() || role.permissionId === null) {
            toast.error("All Fileds are required");
            return;
        }
        setIsSubmitting(true);
        try {
            if (roleEditingId) {
                const current = role.permissionId;
                const original = correntRole;

                const toAdd = current.filter((id) => !original.includes(id));
                const toRemove = original.filter((id) => !current.includes(id));
                const permData = { toAdd, toRemove };

                const { data } = await updateRoles(roleEditingId, permData);
                toast.success(data?.message);
            } else {
                const { data } = await createRole(role);
                toast.success(data?.message);
            }

            fetchRole();
            setRole({ roleName: "", permissionId: [] });
            setRole((prev) => ({
                ...prev,
                permissionId: [],
            }));
        } catch (err) {
            console.error(err.response.data);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveRole = async (id: string) => {
        try {
            const { data } = await deleteRoles(id);
            toast.success(data.message);
            fetchRole();
        } catch (err) {
            console.error("Error Deleting Roles: ", err.message);
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

            {/* Main Workspace Grid */}
            <main className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-5 bg-green-400 ">
                {/* Left Column: Create Management Action Panel */}

                {/* PERMISSION CREATTION */}
                <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm h-fit  bg-green-500">
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">
                        Create New Permission
                    </h2>
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

                {/* ROLE CREATTION */}
                <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm h-fit">
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">
                        Create New Role
                    </h2>
                    <p className="text-xs text-slate-500 mb-4">
                        Define a new system boundary access level group.
                    </p>

                    {/* Mock Input Form fields for nice UI context */}
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
                                                perm._id,
                                            );

                                        return (
                                            <label
                                                key={perm._id}
                                                className={`flex items-start gap-3 p-2 rounded-lg border transition-all cursor-pointer text-sm select-none ${
                                                    isChecked
                                                        ? "bg-indigo-50/60 border-indigo-200 text-indigo-900"
                                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() =>
                                                        handlePermissionToggle(
                                                            perm._id,
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
                </section>

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
                                                        handleRemove(perm._id)
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
                                                        className={`p-1.5 rounded transition-colors ${
                                                            editingId ===
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
                                <h2>Avalialable Roles </h2>
                                <ul className="divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
                                    {roles?.map((perm) => (
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
                                                            className={`p-1.5 rounded transition-colors ${
                                                                roleEditingId ===
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
        </div>
    );
}
