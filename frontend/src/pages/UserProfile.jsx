import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import defaultProfileImage from "../assets/profile.png";
import uploadImageToCloudinary from "../Cloudinary/ImageUpdload";
import { uploadImage } from "../redux/userAuthSlice";
import Swal from "sweetalert2"; 

const Profile = () => {
    const { user } = useSelector((state) => state.userAuth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [image, setImage] = useState(user?.profile_image || defaultProfileImage);
    const [newImage, setNewImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
            setNewImage(file);
        }
    };

    const handleSaveImage = async () => {
        if (newImage) {
            try {
                const imgUrl = await uploadImageToCloudinary(newImage);
                if (imgUrl) {
                    dispatch(uploadImage({ id: user.id, profileImage: imgUrl }));
                    setImage(imgUrl);
                    setNewImage(null);

                    Swal.fire({
                        icon: 'success',
                        title: 'Profile Image Updated!',
                        text: 'Your profile image has been successfully updated.',
                        confirmButtonText: 'Okay'
                    });
                }
            } catch (error) {
                console.error("Error uploading image:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'There was an error uploading your profile image.',
                    confirmButtonText: 'Try Again'
                });
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center relative">
            <button 
                className="absolute top-8 left-8 text-gray-600 hover:text-gray-800 transition"
                onClick={() => navigate(-1)}
            >
                <FontAwesomeIcon icon={faArrowLeft} size="xl" />
            </button>

            <div className="bg-white p-12 rounded-lg shadow-xl w-[450px] flex flex-col items-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>

                <div className="relative">
                    <img
                        src={image}
                        alt="Profile"
                        className="w-40 h-40 rounded-full border-4 border-gray-300 object-cover"
                    />

                    <label className="absolute bottom-1 left-1 bg-gray-700 text-white p-3 rounded-full cursor-pointer">
                        <FontAwesomeIcon icon={faCamera} size="lg" />
                        <input 
                            type="file" 
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </label>
                </div>

                <div className="mt-6 w-full">
                    <div className="flex flex-col items-start w-full">
                        <label className="text-gray-600 font-medium mb-1">Name:</label>
                        <input 
                            type="text"
                            value={user?.name}
                            readOnly
                            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 text-lg cursor-not-allowed"
                        />
                    </div>

                    <div className="flex flex-col items-start w-full mt-4">
                        <label className="text-gray-600 font-medium mb-1">Email:</label>
                        <input 
                            type="text"
                            value={user?.email}
                            readOnly
                            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 text-lg cursor-not-allowed"
                        />
                    </div>
                </div>

                {newImage && (
                    <button 
                        onClick={handleSaveImage}
                        className="mt-8 px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center space-x-2 w-full justify-center text-lg"
                    >
                        <FontAwesomeIcon icon={faSave} />
                        <span>Save Image</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Profile;
