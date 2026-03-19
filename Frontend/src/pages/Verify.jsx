import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { server } from "../main.jsx";

const Verify = () => {
    const { token } = useParams();

    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const verifyUser = async () => {
        try {
            const { data } = await axios.post(
                `${server}/api/v1/verify/${token}`
            );

            setSuccessMessage(data.message);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || "Verification failed"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        verifyUser();
    }, []);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 text-white">

            <div className="w-full max-w-md border border-zinc-800 rounded-xl p-8 bg-black shadow-xl text-center">

                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <span className="px-4 py-1 border border-zinc-700 rounded-full text-sm text-zinc-300">
                        AUTHVAULT
                    </span>
                </div>

                {/* Loading */}
                {loading && (
                    <p className="text-zinc-400 text-lg">Verifying...</p>
                )}

                {/* Success */}
                {!loading && successMessage && (
                    <>
                        <p className="text-green-500 text-2xl mb-4">
                            Account Verified ✅
                        </p>
                        <p className="text-zinc-400 mb-6">
                            {successMessage}
                        </p>

                        <Link
                            to="/login"
                            className="inline-block bg-white text-black px-6 py-2 rounded-full hover:bg-zinc-200 transition"
                        >
                            Go to Login
                        </Link>
                    </>
                )}

                {/* Error */}
                {!loading && errorMessage && (
                    <>
                        <p className="text-red-500 text-2xl mb-4">
                            Verification Failed ❌
                        </p>
                        <p className="text-zinc-400 mb-6">
                            {errorMessage}
                        </p>

                        <Link
                            to="/register"
                            className="inline-block bg-white text-black px-6 py-2 rounded-full hover:bg-zinc-200 transition"
                        >
                            Try Again
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Verify;