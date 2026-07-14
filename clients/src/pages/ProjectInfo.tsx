import { useState } from "react";
import {
    Users,
    Layers,
    ShieldAlert,
    CheckSquare,
    GitFork,
    Key,
    Lock,
    ArrowRight
} from "lucide-react";

type TabType = "overview" | "database" | "permissions" | "workflows";

export function ProjectDetails() {
    const [activeTab, setActiveTab] = useState<TabType>("overview");

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8 lg:p-12">
            {/* Header Container */}
            <div className="max-w-6xl mx-auto mb-8">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 mb-3">
                    System Architecture Documentation
                </span>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Departmental Task Manager Engine
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    A comprehensive breakdown of schemas, role hierarchies, and system control layers.
                </p>
            </div>

            {/* Dynamic Tab Panel Selection */}
            <div className="max-w-6xl mx-auto mb-8 flex border-b border-slate-200 overflow-x-auto gap-2">
                {(
                    [
                        { id: "overview", label: "Core Concept", icon: Users },
                        { id: "database", label: "Database Models", icon: Layers },
                        { id: "permissions", label: "Role Hierarchy", icon: ShieldAlert },
                        { id: "workflows", label: "Action Workflows", icon: GitFork },
                    ] as const
                ).map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${activeTab === tab.id
                            ? "border-indigo-600 text-indigo-600 font-bold"
                            : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Documentation Wrapper Content */}
            <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">

                {/* TAB 1: SYSTEM OVERVIEW */}
                {/* TAB 1: SYSTEM OVERVIEW (OPTIMIZED FOR INTERVIEWERS) */}
                {activeTab === "overview" && (
                    <div className="space-y-8 animate-fadeIn text-sm">

                        {/* 1. Quick Pitch Elevator Statement */}
                        <div className="border-l-4 border-indigo-600 pl-4 py-1">
                            <h2 className="text-xl font-bold text-slate-950 mb-1">The High-Level Pitch</h2>
                            <p className="text-slate-600 leading-relaxed max-w-3xl">
                                A multi-tenant corporate workforce application managing departmental tasks through a hybrid access engine combining hardcoded security boundaries (<code className="font-mono text-indigo-600 bg-indigo-50/50 px-1 rounded font-bold">userType</code>) and dynamic granular system actions via database-relational Role-Based Access Control (<code className="font-mono text-teal-600 bg-teal-50/50 px-1 rounded font-bold">RBAC</code>).
                            </p>
                        </div>

                        {/* 2. Core Technical Stack Badges */}
                        <div>
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Engine Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-slate-900 text-slate-50 font-medium rounded-md text-xs font-mono">React 19</span>
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 font-medium rounded-md text-xs font-mono">TypeScript</span>
                                <span className="px-3 py-1 bg-teal-50 text-teal-700 border border-teal-100 font-medium rounded-md text-xs font-mono">Tailwind CSS</span>
                                <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-100 font-medium rounded-md text-xs font-mono">Node.js / Express</span>
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium rounded-md text-xs font-mono">MongoDB / Mongoose</span>
                            </div>
                        </div>

                        {/* 3. Three Killer Features / Engineering Highlights */}
                        <div>
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Who Can Do What?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                                {/* Admin */}
                                <div className="p-4 border border-slate-200/60 rounded-xl bg-white shadow-sm">
                                    <div className="px-2.5 py-1 text-xs font-bold bg-red-50 text-red-700 rounded-lg w-fit mb-3">
                                        Admin
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-2">Full Control</h4>
                                    <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4">
                                        <li>Create Departments</li>
                                        <li>Assign any User type/role</li>
                                        <li>Create & assign any task</li>
                                        <li>Delete anything</li>
                                    </ul>
                                </div>

                                {/* Dept Head */}
                                <div className="p-4 border border-slate-200/60 rounded-xl bg-white shadow-sm">
                                    <div className="px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-700 rounded-lg w-fit mb-3">
                                        Dept Head
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-2">Manager Control</h4>
                                    <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4">
                                        <li>Manage tasks in their department</li>
                                        <li>Create departmentless tasks</li>
                                        <li>Assign tasks to their own members</li>
                                    </ul>
                                </div>

                                {/* Member */}
                                <div className="p-4 border border-slate-200/60 rounded-xl bg-white shadow-sm">
                                    <div className="px-2.5 py-1 text-xs font-bold bg-teal-50 text-teal-700 rounded-lg w-fit mb-3">
                                        Member
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-2">Work Control</h4>
                                    <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4">
                                        <li>View assigned tasks</li>
                                        <li>Update task progress</li>
                                        <li>Change task status</li>
                                    </ul>
                                </div>

                                {/* User */}
                                <div className="p-4 border border-slate-200/60 rounded-xl bg-white shadow-sm">
                                    <div className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-600 rounded-lg w-fit mb-3">
                                        New User
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-2">Zero Control</h4>
                                    <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4">
                                        <li>Fresh signups default here</li>
                                        <li>Completely locked out</li>
                                        <li>Waiting for Admin approval</li>
                                    </ul>
                                </div>

                            </div>
                        </div>

                    </div>
                )}

                {/* TAB 2: SCHEMAS & DATABASE DICTIONARY */}
                {activeTab === "database" && (
                    <div className="space-y-8 animate-fadeIn">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-1">Mongoose Schemas</h2>
                            <p className="text-sm text-slate-500">Relational mappings and data attributes defined inside MongoDB.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* User Model */}
                            <div className="p-5 border border-slate-200/80 rounded-xl bg-slate-50/50">
                                <h3 className="font-bold text-sm text-indigo-600 flex items-center gap-1.5 mb-3">
                                    <Users size={16} /> User Schema
                                </h3>
                                <ul className="space-y-2 text-xs text-slate-600">
                                    <li><strong className="text-slate-800">name / email:</strong> String properties capturing identities securely.</li>
                                    <li><strong className="text-slate-800">userType:</strong> Hardcoded security boundary enum: <code className="bg-slate-100 px-1 rounded text-red-600 font-mono">["admin", "head", "member", "user"]</code>.</li>
                                    <li><strong className="text-slate-800">roles:</strong> Object reference pointing to custom dynamic <code className="text-slate-800">Role</code> model bindings.</li>
                                    <li><strong className="text-slate-800">department:</strong> Foreign reference string pointing back to assigned <code className="text-slate-800">Department</code>.</li>
                                </ul>
                            </div>

                            {/* Department Model */}
                            <div className="p-5 border border-slate-200/80 rounded-xl bg-slate-50/50">
                                <h3 className="font-bold text-sm text-teal-600 flex items-center gap-1.5 mb-3">
                                    <Layers size={16} /> Department Schema
                                </h3>
                                <ul className="space-y-2 text-xs text-slate-600">
                                    <li><strong className="text-slate-800">name / code:</strong> Structural identifiers for corporate group division tracking.</li>
                                    <li><strong className="text-slate-800">head:</strong> Referencing object ID belonging to user validating role type matching <code className="text-slate-800">"head"</code>.</li>
                                </ul>
                            </div>

                            {/* Role & Permission */}
                            <div className="p-5 border border-slate-200/80 rounded-xl bg-slate-50/50">
                                <h3 className="font-bold text-sm text-amber-600 flex items-center gap-1.5 mb-3">
                                    <Key size={16} /> RBAC Infrastructure (Role & Permission)
                                </h3>
                                <p className="text-xs text-slate-500 mb-2">Dynamic structural rule settings populated by organizational authorities.</p>
                                <ul className="space-y-2 text-xs text-slate-600">
                                    <li><strong className="text-slate-800">Role Name:</strong> Dynamic grouping category mapping permissions.</li>
                                    <li><strong className="text-slate-800">permission:</strong> Array of reference IDs listing granular operational rights.</li>
                                    <li><strong className="text-slate-800">createdBy:</strong> Accountability tracker binding object creations to active Users.</li>
                                </ul>
                            </div>

                            {/* Task Model */}
                            <div className="p-5 border border-slate-200/80 rounded-xl bg-slate-50/50">
                                <h3 className="font-bold text-sm text-emerald-600 flex items-center gap-1.5 mb-3">
                                    <CheckSquare size={16} /> Task Schema
                                </h3>
                                <ul className="space-y-2 text-xs text-slate-600">
                                    <li><strong className="text-slate-800">title / description:</strong> Metric definitions framing deliverables.</li>
                                    <li><strong className="text-slate-800">priority:</strong> Operational classifications indicating severity levels.</li>
                                    <li><strong className="text-slate-800">department:</strong> Pointer linking scope visibility boundaries to targeted operations lines.</li>
                                    <li><strong className="text-slate-800">createdBy:</strong> Direct accountability binding records to creators.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: ACCESS LIMITATIONS & AUTHORITY MATRICES */}
                {activeTab === "permissions" && (
                    <div className="space-y-6 animate-fadeIn">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-1">Functional Matrix & Hierarchy Scope</h2>
                            <p className="text-sm text-slate-500">System architecture clearance map grouped by account states.</p>
                        </div>

                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse text-xs md:text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                                        <th className="p-4">User Type</th>
                                        <th className="p-4">Operational Boundaries & Actions Available</th>
                                        <th className="p-4">Access Scope</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-600">
                                    <tr>
                                        <td className="p-4 font-bold text-red-600 flex items-center gap-1"><Lock size={14} /> Admin</td>
                                        <td className="p-4">Create, edit, or purge departments, assign master roles, delete globally across databases, re-route tasks to users.</td>
                                        <td className="p-4"><span className="px-2 py-0.5 bg-red-50 border border-red-100 rounded text-red-700 text-xs font-semibold">Global (Root)</span></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold text-amber-600 flex items-center gap-1"><ShieldAlert size={14} /> Dept Head</td>
                                        <td className="p-4">Author cross-functional workflows. Create/assign tasks scoped exclusively inside their own operational division or create departmentless generic targets. Only assign members operating inside their department boundaries.</td>
                                        <td className="p-4"><span className="px-2 py-0.5 bg-amber-50 border border-amber-100 rounded text-amber-700 text-xs font-semibold">Department Scoped</span></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold text-teal-600 flex items-center gap-1"><Users size={14} /> Member</td>
                                        <td className="p-4">Process functional delivery runs. Execute processing queues, update pipeline milestones, and state lifecycle changes.</td>
                                        <td className="p-4"><span className="px-2 py-0.5 bg-teal-50 border border-teal-100 rounded text-teal-700 text-xs font-semibold">Assigned Metrics</span></td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold text-slate-400 flex items-center gap-1"><Users size={14} /> User</td>
                                        <td className="p-4">Initial signup isolation state. Completely locked out of core workflow boards until explicitly vetted and elevated by an Administrator.</td>
                                        <td className="p-4"><span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 text-xs font-semibold">Read Only / Isolated</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 4: ACTION REGISTRATION FLOWS */}
                {activeTab === "workflows" && (
                    <div className="space-y-6 animate-fadeIn">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-1">Onboarding & Allocation Lifecycle</h2>
                            <p className="text-sm text-slate-500">How records process across standard platform tracks.</p>
                        </div>

                        <div className="space-y-4 max-w-2xl">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">Account Creation & Isolation</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">Fresh account signups default structurally to the <code className="font-mono bg-slate-100 px-1 rounded text-slate-700">"user"</code> type enum. They see empty dashboards and remain fully quarantined from database records.</p>
                                </div>
                            </div>
                            <div className="flex justify-center w-8 text-slate-300 py-1"><ArrowRight size={16} className="rotate-90" /></div>

                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">Corporate Alignment Mapping</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">The Admin updates the user record, escalating their status enum to <code className="font-mono bg-slate-100 px-1 rounded text-indigo-700">"member"</code> or <code className="font-mono bg-slate-100 px-1 rounded text-amber-700">"head"</code> and binding them to a specific structural department reference.</p>
                                </div>
                            </div>
                            <div className="flex justify-center w-8 text-slate-300 py-1"><ArrowRight size={16} className="rotate-90" /></div>

                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">Task Generation Pipeline</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">Department heads create deliverables scoped to their division. These are instantly pushed down to the processing views of all matching departmental members.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}