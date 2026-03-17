import React from "react";

const Loading = () => {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white">

            <div className="flex flex-col items-center gap-6">

                {/* Logo */}
                <div className="px-6 py-2 border border-zinc-700 rounded-full text-sm text-zinc-300">
                    AUTHVAULT
                </div>

                {/* Spinner */}
                <div className="w-10 h-10 border-2 border-zinc-700 border-t-white rounded-full animate-spin"></div>

                {/* Text */}
                <p className="text-zinc-400 text-sm">
                    Verifying your access...
                </p>

            </div>

        </div>
    );
};

export default Loading;