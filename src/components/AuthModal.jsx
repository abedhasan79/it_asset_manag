import React, { useState } from "react";
import api from "../services/api";
import { getCurrentUser } from "../services/api";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "staff",
    });

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const route = isLogin ? "/auth/login" : "/auth/register";
            const response = await api.post(route, formData);
            localStorage.setItem("token", response.data.token);

            // Fetch user info after storing token
            const user = await getCurrentUser();
            onAuthSuccess(user);

            onClose();
        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[90%] sm:w-[400px] p-6 shadow-xl relative">
                <h2 className="text-xl font-semibold text-center mb-4">
                    {isLogin ? "Login" : "Register"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            className="w-full border p-2 rounded"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full border p-2 rounded"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full border p-2 rounded"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    {!isLogin && (
                        <select
                            name="role"
                            className="w-full border p-2 rounded"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="staff">Staff</option>
                            <option value="it">IT Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                    >
                        {isLogin ? "Login" : "Register"}
                    </button>
                </form>

                <p className="mt-4 text-sm text-center text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-500 hover:underline"
                    >
                        {isLogin ? "Register" : "Login"}
                    </button>
                </p>

                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-800"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}