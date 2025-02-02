import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { adminLogout, fetchUsers, updateUser, deleteUser, addUser } from "../redux/adminAuthSlice";

const AdminPanel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { adminToken, users, isLoading, error } = useSelector((state) => state.adminAuth);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUserAddOpen, setIsUserAddOpen] = useState(false);
    
    const [editUser, setEditUser] = useState({ id: "", name: "", email: "" });
    const [addUserData, setAddUserData] = useState({ name: "", email: "", password: "" });
    const [delUser, setDeleteUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!adminToken) {
            navigate("/admin_login");
        } else {
            dispatch(fetchUsers());
        }
    }, [adminToken, navigate, dispatch]);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const openEditModal = (user) => { 
        setEditUser({ id: user.id || "", name: user.name || "", email: user.email || "" });
        setIsModalOpen(true);
    };

    const openAddUserModal = () => {
        setAddUserData({ name: "", email: "", password: "" });
        setIsUserAddOpen(true);
    };

    const openDeleteModal = (user) => {
        setDeleteUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleInputChange = (e) => {
        setEditUser({ ...editUser, [e.target.name]: e.target.value });
    };

    const handleAddUserChange = (e) => {
        setAddUserData({ ...addUserData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (!validateEmail(editUser.email)) {
            return Swal.fire("Error", "Invalid email format", "error");
        }
        
        if (users.some(user => user.email === editUser.email && user.id !== editUser.id)) {
            return Swal.fire("Error", "Email already exists", "error");
        }
        dispatch(updateUser(editUser)).then(() => dispatch(fetchUsers()));
        Swal.fire("Success", "User updated successfully", "success");
        setIsModalOpen(false);
    };

    const handleAddUser = () => {
        if (!validateEmail(addUserData.email)) {
            return Swal.fire("Error", "Invalid email format", "error");
        }
        
        if (addUserData.password.length < 6) {
            return Swal.fire("Error", "Password must be at least 6 characters long", "error");
        }
        
        if (users.some(user => user.email === addUserData.email)) {
            return Swal.fire("Error", "Email already exists", "error");
        }
        dispatch(addUser(addUserData)).then(() => dispatch(fetchUsers()));
        Swal.fire("Success", "User added successfully", "success");
        setIsUserAddOpen(false);
    };

    const handleDelete = () => {
        if (!delUser || !delUser.id) return;
        dispatch(deleteUser(delUser.id)).then(() => dispatch(fetchUsers()));
        Swal.fire("Success", "User deleted successfully", "success");
        setIsDeleteModalOpen(false);
    };

    const handleLogout = () => {
        dispatch(adminLogout());
        navigate("/admin_login");
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">

    <nav className="bg-gradient-to-r from-teal-600 to-cyan-500 p-4 w-full flex justify-between items-center shadow-lg">
        <h1 className="text-white text-3xl font-bold">Admin Panel</h1>
        <button
            onClick={handleLogout}
            className="bg-teal-500 hover:bg-teal-600 px-6 py-2 text-white rounded-full transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none"
        >
            Logout
        </button>
    </nav>

    <div className="p-6 bg-gray-800">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
            <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-600 bg-gray-700 text-white p-3 w-1/2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
                onClick={openAddUserModal}
                className="bg-teal-500 hover:bg-teal-600 px-6 py-2 text-white rounded-full transition-colors duration-200"
            >
                Add New User
            </button>
        </div>
    </div>

    <div className="p-6 w-full flex justify-center">
        <div className="w-full max-w-4xl">
            {isLoading && <p className="text-gray-400">Loading users...</p>}
            {error && <p className="text-red-400">{error}</p>}
            <table className="w-full bg-gray-800 rounded-lg shadow-md table-fixed">
                <thead>
                    <tr className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                        <th className="p-4 text-left w-1/3">Name</th>
                        <th className="p-4 text-left w-1/3">Email</th>
                        <th className="p-4 text-left w-1/3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users
                        .filter(user =>
                            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((user) => (
                            <tr key={user.id} className="border-t border-gray-700 hover:bg-gray-700">
                                <td className="p-4">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4 flex gap-2">
                                    <button
                                        onClick={() => openEditModal(user)}
                                        className="bg-teal-500 hover:bg-teal-600 px-4 py-2 text-white rounded-full transition-colors duration-200"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(user)}
                                        className="bg-red-500 hover:bg-red-600 px-4 py-2 text-white rounded-full transition-colors duration-200"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    </div>



    {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-6 rounded shadow-md">
                <h2 className="text-xl font-bold">Edit User</h2>
                <input
                    type="text"
                    name="name"
                    value={editUser.name}
                    onChange={handleInputChange}
                    className="border border-gray-600 bg-gray-700 text-white p-2 w-full my-2"
                    placeholder="Name"
                />
                <input
                    type="email"
                    name="email"
                    value={editUser.email}
                    onChange={handleInputChange}
                    className="border border-gray-600 bg-gray-700 text-white p-2 w-full my-2"
                    placeholder="Email"
                />
                <button
                    onClick={handleSave}
                    className="bg-teal-500 px-4 py-2 text-white rounded mr-2"
                >
                    Save
                </button>
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-600 px-4 py-2 text-white rounded"
                >
                    Cancel
                </button>
            </div>
        </div>
    )}



    {isUserAddOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-6 rounded shadow-md">
                <h2 className="text-xl font-bold">Add New User</h2>
                <input
                    type="text"
                    name="name"
                    value={addUserData.name}
                    onChange={handleAddUserChange}
                    className="border border-gray-600 bg-gray-700 text-white p-2 w-full my-2"
                    placeholder="Name"
                />
                <input
                    type="email"
                    name="email"
                    value={addUserData.email}
                    onChange={handleAddUserChange}
                    className="border border-gray-600 bg-gray-700 text-white p-2 w-full my-2"
                    placeholder="Email"
                />
                <input
                    type="password"
                    name="password"
                    value={addUserData.password}
                    onChange={handleAddUserChange}
                    className="border border-gray-600 bg-gray-700 text-white p-2 w-full my-2"
                    placeholder="Password"
                />
                <button
                    onClick={handleAddUser}
                    className="bg-teal-500 px-4 py-2 text-white rounded mr-2"
                >
                    Add User
                </button>
                <button
                    onClick={() => setIsUserAddOpen(false)}
                    className="bg-gray-600 px-4 py-2 text-white rounded"
                >
                    Cancel
                </button>
            </div>
        </div>
    )}




    {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-6 rounded shadow-md">
                <h2 className="text-xl font-bold">Confirm Delete</h2>
                <p>
                    Are you sure you want to delete <strong>{delUser?.name}</strong>?
                </p>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 px-4 py-2 text-white rounded mr-2"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="bg-gray-600 px-4 py-2 text-white rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )}
    </div>


    );
};

export default AdminPanel;
