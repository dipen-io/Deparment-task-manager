import { useEffect, useState } from "react";
import {
  getPermission,
  createPermission,
  removePermission,
} from "../api/roleApi";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export function RoleComponents() {
  const [permission, setPermission] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permLoading, setPermLoading] = useState(false);
  const [permissionForm, setPermissionForm] = useState({ name: "", desc: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPermissionForm((prev) => ({
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

  useEffect(() => {
    fetchPerm();
  }, []);

  const handleSubmitPermission = async (e) => {
    if (!permissionForm.name) {
      return;
    }
    e.preventDefault();
    setPermLoading(true);
    try {
      const { data } = await createPermission(permissionForm);
      toast.success(data.message);
      fetchPerm();
    } catch (err) {
      const backendMessage =
        err.response?.data?.message || "An unexpected system error occurred.";
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
      <main className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Create Management Action Panel */}
        <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm h-fit">
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
                name="name"
                value={permissionForm.name}
                onChange={handleChange}
                required
                placeholder="e.g., CREATE_TASK"
                className="w-full mb-2 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors"
              />
              <input
                type="text"
                name="desc"
                value={permissionForm.desc}
                onChange={handleChange}
                placeholder="Enter desc.."
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <button
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm py-2.5 px-4 rounded-lg shadow transition-colors duration-150"
              onClick={handleSubmitPermission}
            >
              {permLoading ? "creating..." : "Generate Role Permission"}
            </button>
          </div>
        </section>

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
                placeholder="e.g., Support Lead"
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm py-2.5 px-4 rounded-lg shadow transition-colors duration-150">
              Generate Role Group
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
                Live dynamic string definitions compiled from MongoDB.
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
              No custom string keys populated yet. Create your first baseline
              permission.
            </div>
          ) : (
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
                            No descriptive brief provided.
                          </span>
                        )}
                      </p>
                    </div>
                    <div
                      className="text-red-900 hover:text-white hover:bg-red-500 h-8 p-1 hover:rounded"
                      onClick={() => handleRemove(perm._id)}
                    >
                      <p>{<X />} </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
