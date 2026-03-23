import { useRef, useState } from "react";
import axios from "axios";
import { server } from "../main.jsx";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { AppData } from "../context/AppContex.jsx";

const VerifyOtp = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputs = useRef([]);
    const navigate = useNavigate();
    const {setIsAuth,setUser} = AppData()

    const email = localStorage.getItem("email");

    const handleChange = (value, index) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const verifyOtp = async () => {
        const code = otp.join("");

        if (code.length !== 6) {
            return toast.error("Enter complete OTP");
        }

        try {
            const res = await axios.post(`${server}/api/v1/verify`, {
                email,
                otp: code,
            },{
                withCredentials:true
            });

            toast.success(res.data.message);
            setIsAuth(true)
            setUser(res.data.user)
            localStorage.removeItem("email");
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "OTP verification failed");
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 text-white">

            <div className="w-full max-w-md border border-zinc-800 rounded-xl p-8 bg-black shadow-xl">

                <h1 className="text-3xl font-semibold text-center mb-2">
                    Verify OTP
                </h1>

                <p className="text-zinc-400 text-center mb-8 text-sm">
                    Enter the 6 digit code sent to your email
                </p>

                {/* OTP Inputs */}
                <div className="flex justify-between gap-3 mb-8">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={digit}
                            ref={(el) => (inputs.current[index] = el)}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="w-12 h-14 text-center text-xl bg-transparent border border-zinc-700 rounded-lg focus:border-white outline-none"
                        />
                    ))}
                </div>

                {/* Verify Button */}
                <button
                    onClick={verifyOtp}
                    className="w-full bg-white text-black py-3 rounded-full font-medium hover:bg-zinc-200 transition"
                >
                    Verify OTP
                </button>

                {/* Go back to login */}
                <p className="text-center text-sm text-zinc-400 mt-6">
                    Didn’t receive the OTP?{" "}
                    <Link
                        to="/login"
                        onClick={() => localStorage.removeItem("email")}
                        className="text-white underline hover:text-zinc-300"
                    >
                        Go back to login
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default VerifyOtp;