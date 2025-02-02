import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userAuthSlice";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, token ,counter} = useSelector((state) => state.userAuth);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <nav className="bg-teal-700 text-white py-4 px-6 flex justify-between items-center shadow-md">
                <h1 className="text-2xl font-bold">Home Page</h1>
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-2 focus:outline-none"
                    >
                        <img 
                            src={user?.profile_image || "https://via.placeholder.com/40"} 
                            alt="Profile" 
                            className="w-10 h-10 rounded-full border-2 border-white"
                        />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden">
                            <button
                                onClick={() => navigate("/profile")}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                            >
                                Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white text-gray-700"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <div className="flex flex-col items-center justify-center mt-20">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
                    <h1 className="text-2xl font-bold text-teal-700 mb-4">
                        Welcome, {user?.name}!
                    </h1>
                </div>
            </div>
        </div>
    );
};

export default Home;
