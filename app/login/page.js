'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { loginAdmin } from "@/services/adminService";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await loginAdmin(formData.username, formData.password);
            router.push("/admin");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-400 to-indigo-500 relative overflow-hidden">
            {/* Background image */}
            <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-20 z-0"
                style={{ backgroundImage: 'url(/assets/795b7537b2f79ce178703d9d142caf45502cf729.png)' }}
            ></div>

            {/* Login Card */}
            <div className="bg-white/20 backdrop-blur-xl p-8 rounded-2xl text-center shadow-xl relative z-10 w-[90%] max-w-sm">
                <h1 className="text-3xl font-bold text-white mb-4">Admin Login</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        className="p-2 rounded-lg bg-white/40 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    />

                    {/* Password Input with Toggle */}
                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 pr-10 rounded-lg bg-white/40 text-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                        />
                        <button
                            type="button"
                            aria-label="Toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 cursor-pointer"
                            style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                right: "10px",
                            }}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {error && <p className="text-red-200 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`mt-2 p-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-indigo-700 
              transform hover:scale-105 transition-all duration-200 ease-in-out 
              active:scale-95 hover:shadow-lg cursor-pointer ${loading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>
            </div>
        </div>
    );
}