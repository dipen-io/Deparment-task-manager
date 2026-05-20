import { useEffect, useState } from "react";
import { getUsers } from "../api/userApi";
import { getRole, assingUserRole } from "../api/roleApi";

export function AssignUserRole() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});

  const fetchUsers = async () => {
    const { data } = await getUsers();
    setUsers(data.users);
  };

  console.log(users);

  const fetchRole = async () => {
    const { data } = await getRole();
    setRoles(data?.data || []);
  };

  useEffect(() => {
    fetchUsers();
    fetchRole();
  }, []);

  const handleRoleChange = (userId, roleId) => {
    setSelectedRole((prev) => ({
      ...prev,
      [userId]: roleId,
    }));
  };

  const updateUserRole = async (userId) => {
    const roleId = selectedRole[userId];
    if (!roleId) return;
    console.log(roleId);
    console.log(userId);
    const { data } = await assingUserRole(roleId, userId);
    console.log(data);
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Assign User Roles</h1>
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
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>

              {/* Role Select */}
              <div>
                <select
                  value={selectedRole[user._id] || user.roles?._id || ""}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
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
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
