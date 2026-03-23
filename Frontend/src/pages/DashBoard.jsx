import React, { useEffect, useState } from "react";
import { AppData } from "../context/AppContex";
import api from "../apiIntercepter";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { logoutUser, user } = AppData();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        // ✅ protect route (frontend level)
        if (user?.role !== "admin") {
            navigate("/");
            return;
        }

        const fetchUsers = async () => {
            try {
                const { data } = await api.get("/api/v1/all-users");
                setUsers(data.users);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user]);

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>

                <div className="flex gap-3">
                    <Link
                        to="/"
                        className="px-4 py-2 bg-purple-500 rounded-lg text-sm hover:bg-purple-600 transition"
                    >
                        Home
                    </Link>

                    <button
                        onClick={logoutUser}
                        className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Loading */}
            {loading ? (
                <p className="text-center text-zinc-400">Loading users...</p>
            ) : (
                <div className="bg-zinc-900 p-6 rounded-2xl shadow-lg">

                    <h2 className="text-xl font-semibold mb-4">
                        All Users ({users.length})
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-zinc-400 border-b border-zinc-700">
                                    <th className="py-2">Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="py-4 text-center text-zinc-500">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((u) => (
                                        <tr key={u._id} className="border-b border-zinc-800">
                                            <td className="py-3">{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span
                                                    className={`px-2 py-1 rounded text-sm ${
                                                        u.role === "admin"
                                                            ? "bg-purple-500/20 text-purple-400"
                                                            : "bg-zinc-700 text-zinc-300"
                                                    }`}
                                                >
                                                    {u.role}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;