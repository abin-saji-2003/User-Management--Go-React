import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login} from "../redux/userAuthSlice";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error, token } = useSelector((state) => state.userAuth);

    useEffect(() => {
        if (token) {
            navigate("/");
        }
    }, [token, navigate]);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(credentials)).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                navigate("/");
            } else if (result.meta.requestStatus === "rejected" && error) {
                Swal.fire({
                    toast: true,
                    icon: "error",
                    title: "Invalide email or password",
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-bold text-teal-700 mb-4">Login</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
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
                    <button
                        type="submit"
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-200"
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                    
                </form>

                <p className="mt-4 text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-teal-600 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
