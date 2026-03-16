import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { server } from '../main.jsx'
import { toast } from "react-toastify";
import axios from 'axios'
const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();

    const submitHandler = async (data) => {
        try {
            const res = await axios.post(`${server}/api/v1/login`, data);
            toast.success(res.data.message);
            localStorage.setItem("email",data.email)
            navigate('/verifyotp')
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 text-white">

            <form
                onSubmit={handleSubmit(submitHandler)}
                className="w-full max-w-md border border-zinc-800 rounded-xl p-8 bg-black shadow-xl"
            >

                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <span className="px-4 py-1 border border-zinc-700 rounded-full text-sm text-zinc-300">
                        AUTHVAULT
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-semibold text-center mb-2">
                    Login
                </h1>

                <p className="text-zinc-400 text-center mb-8 text-sm">
                    Enter your email and password
                </p>

                {/* Email */}
                <div className="mb-6">
                    <label className="flex items-center gap-2 text-zinc-300 text-sm mb-2">
                        <Mail size={16} />
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full bg-transparent text-white border-b border-zinc-700 focus:border-white outline-none py-2 placeholder:text-zinc-500"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Enter a valid email",
                            },
                        })}
                    />

                    {errors.email && (
                        <p className="text-red-400 text-sm mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="mb-8">
                    <label className="flex items-center gap-2 text-zinc-300 text-sm mb-2">
                        <Lock size={16} />
                        Password
                    </label>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="w-full bg-transparent text-white border-b border-zinc-700 focus:border-white outline-none py-2 pr-8 placeholder:text-zinc-500"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-2 text-zinc-400 hover:text-white"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}

                        </button>
                    </div>

                    {errors.password && (
                        <p className="text-red-400 text-sm mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-black py-3 rounded-full font-medium hover:bg-zinc-200 transition"
                >
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>

                {/* Signup */}
                <p className="text-center text-sm text-zinc-400 mt-6">
                    Don't have an account?{" "}
                    <Link to='/register' className="text-white underline hover:text-zinc-300">
                        Sign up
                    </Link>
                </p>

            </form>
        </div>
    );
};

export default Login;