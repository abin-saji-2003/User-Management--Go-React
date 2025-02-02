import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../redux/userAuthSlice";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Signup = () => {
    const [userData, setUserData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state) => state.userAuth);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            Swal.fire({
                toast: true,
                icon: "error",
                title: "Invalid Email Format!",
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
            return;
        }

        if (userData.password.length < 6) {
            Swal.fire({
                toast: true,
                icon: "error",
                title: "Password must be at least 6 characters!",
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            Swal.fire({
                toast: true,
                icon: "error",
                title: "Passwords do not match!",
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
            return;
        }

        try {
            const resultAction = await dispatch(signup(userData));
            if (signup.fulfilled.match(resultAction)) {
                Swal.fire({
                    icon: "success",
                    title: "Signup Successful!",
                    text: "Redirecting to login page...",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => {
                    navigate("/login");
                });
            }
        } catch (err) {
            console.error("Signup Error:", err);
        }
    };

    useEffect(() => {
        if (error) {
            Swal.fire({
                toast: true,
                icon: "error",
                title: error.message || "Something went wrong!",
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        }
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-bold text-teal-700 mb-4">Sign Up</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-200"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-4 text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-teal-600 hover:underline">
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
