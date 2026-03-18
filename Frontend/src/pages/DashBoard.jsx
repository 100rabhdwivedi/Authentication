import React from "react";

const Dashboard = () => {
    const user = {
        name: "Saurabh",
        email: "saurabh@example.com",
        role: "Developer",
    };

    const sessions = [
        { device: "Chrome on Windows", location: "Mumbai, India", status: "Active" },
        { device: "Mobile Safari", location: "Delhi, India", status: "Expired" },
    ];

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">AuthVault Dashboard</h1>
                <button className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600">
                    Logout
                </button>
            </div>

            {/* User Card */}
            <div className="bg-zinc-900 p-6 rounded-2xl mb-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">User Info</h2>
                <p><span className="text-zinc-400">Name:</span> {user.name}</p>
                <p><span className="text-zinc-400">Email:</span> {user.email}</p>
                <p><span className="text-zinc-400">Role:</span> {user.role}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

                <div className="bg-zinc-900 p-6 rounded-2xl">
                    <h3 className="text-zinc-400">Active Sessions</h3>
                    <p className="text-2xl font-bold mt-2">2</p>
                </div>

                <div className="bg-zinc-900 p-6 rounded-2xl">
                    <h3 className="text-zinc-400">Token Status</h3>
                    <p className="text-2xl font-bold mt-2 text-green-400">Valid</p>
                </div>

                <div className="bg-zinc-900 p-6 rounded-2xl">
                    <h3 className="text-zinc-400">Last Login</h3>
                    <p className="text-2xl font-bold mt-2">Today</p>
                </div>

            </div>

            {/* Sessions Table */}
            <div className="bg-zinc-900 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Active Sessions</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-zinc-400 border-b border-zinc-700">
                                <th className="py-2">Device</th>
                                <th>Location</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sessions.map((session, index) => (
                                <tr key={index} className="border-b border-zinc-800">
                                    <td className="py-3">{session.device}</td>
                                    <td>{session.location}</td>
                                    <td>
                                        <span
                                            className={`px-2 py-1 rounded text-sm ${session.status === "Active"
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-red-500/20 text-red-400"
                                                }`}
                                        >
                                            {session.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;