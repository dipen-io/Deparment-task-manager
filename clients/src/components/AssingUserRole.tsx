import { useEffect, useState } from "react";
import { getUsers } from "../api/userApi";
import { getRole, assingUserRole } from "../api/roleApi";
import toast from "react-hot-toast";
import type { Role } from "./types/userType";
import type { Employee } from "../api/userApi";
import axios from "axios";

export function AssignUserRole() {
    const [users, setUsers] = useState<Employee[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [savingRoleId, setSavingRoleId] = useState<string | null>(null);
    const [savingRole, setSavingRole] = useState<boolean>(false);
    const [selectedRole, setSelectedRole] = useState<Record<string, string>>({});

    const fetchUsers = async () => {
        const { data } = await getUsers();
        setUsers(data.users);
    };

    const fetchRole = async () => {
        const { data } = await getRole();
        setRoles(data?.data || []);
    };

    useEffect(() => {
        fetchUsers();
        fetchRole();
    }, []);

    const handleRoleChange = (userId: string, roleId: string) => {
        setSavingRoleId(userId);
        setSelectedRole((prev) => ({
            ...prev,
            [userId]: roleId,
        }));
    };

    const updateUserRole = async (userId: string) => {
        setSavingRoleId(userId);
        setSavingRole(true);
        try {
            const roleId = selectedRole[userId];
            if (!roleId) {
                setSavingRole(false);
                setSavingRoleId(null);
                return;
            }
            const { data } = await assingUserRole(roleId, userId);
            toast.success(data.message);
            fetchUsers();
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.error(err?.response?.data);
            } else {
                console.error("Unknown Error");

            }
        } finally {
            setSavingRole(false);
            setSavingRoleId(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            {/* Header */}
            <div className="max-w-5xl mx-auto mb-6">
                <h1 className="text-2xl font-bold text-slate-900">
                    Assign User Roles
                </h1>
                <p className="text-sm text-slate-500">
                    Manage user access and role mapping
                </p>
            </div>

            {/* Table Container */}
            <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-3 bg-slate-100 px-6 py-3 text-xs font-semibold text-slate-600 uppercase">
                    <span>User</span>
                    <span>Role</span>
                    <span>Action</span>
                </div>

                {/* Rows */}
                <div className="divide-y divide-slate-100">
                    {users.map((user) => (
                        <div
                            key={user._id}
                            className="grid grid-cols-3 items-center px-6 py-4 hover:bg-slate-50 transition"
                        >
                            {/* User */}
                            <div className="font-medium text-slate-800">
                                {user.name}
                                <p className="text-xs text-slate-400">
                                    {user.email}
                                </p>
                            </div>

                            {/* Role Select */}
                            <div>
                                <select
                                    value={
                                        selectedRole[user._id] ||
                                        user.roles?._id ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        handleRoleChange(
                                            user._id,
                                            e.target.value,
                                        )
                                    }
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">Select Role</option>
                                    {roles.map((role) => (
                                        <option key={role._id} value={role._id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={() => updateUserRole(user._id)}
                                    className="px-4 py-2 text-sm font-medium rounded-lg
                  bg-indigo-600 text-white hover:bg-indigo-700
                  transition disabled:opacity-50"
                                >
                                    {savingRole && savingRoleId === user._id
                                        ? "Saving..."
                                        : "Save"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
