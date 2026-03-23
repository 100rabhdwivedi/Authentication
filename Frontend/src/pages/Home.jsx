import React from "react";
import { AppData } from "../context/AppContex";
import { Link } from "react-router-dom";

const Home = () => {
    const { logoutUser, user, isAuth} = AppData();

    console.log(isAuth);
    

console.log(user);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">

            {/* Navbar */}
            <div className="flex justify-between items-center px-8 py-4 border-b border-zinc-800">

                <h1 className="font-semibold text-lg">AuthVault</h1>

                <div className="flex gap-3">

                    {/* ✅ Dashboard button (only for admin) */}
                    {user?.role === "admin" && (
                        <Link
                            to="/dashboard"
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition"
                        >
                            Dashboard
                        </Link>
                    )}

                    <button
                        onClick={logoutUser}
                        className="px-4 py-2 bg-white text-black rounded-lg text-sm hover:bg-zinc-200 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="flex-1 flex items-center justify-center px-6">

                <div className="text-center max-w-2xl">

                    <p className="text-purple-400 font-medium mb-4">
                        AuthVault Authentication
                    </p>

                    <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                        The home for secure authentication
                    </h1>

                    <p className="text-zinc-400 text-lg mb-8">
                        Build secure login systems, verify users with OTP, and manage authentication flows with modern tools.
                    </p>

                    <div className="flex justify-center gap-4">

                        <button className="px-6 py-3 bg-white text-black rounded-lg hover:bg-zinc-200 transition">
                            Get started →
                        </button>

                        <button className="text-zinc-400 hover:text-white">
                            Watch demo →
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Home;