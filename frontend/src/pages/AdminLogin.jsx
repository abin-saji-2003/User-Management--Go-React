import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../redux/adminAuthSlice";

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error, adminToken } = useSelector((state) => state.adminAuth);

    useEffect(() => {
        if (adminToken) {
            navigate("/admin_panel");
        }
    }, [adminToken, navigate]);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(adminLogin(credentials)).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                navigate("/admin_panel");
            }   
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">Admin Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold p-3 rounded-lg transition-colors duration-200"
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                    {error && <p className="text-red-600 text-center">{error.message}</p>}
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
