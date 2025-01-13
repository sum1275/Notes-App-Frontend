import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userInfo, setUserInfo] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false); // State for old password visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // State for new password visibility
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Access the environment variable

  //   console.log("currentUser: ", currentUser); // Add this line to debug currentUser
  //   console.log("userInfo._id: ", userInfo?._id);
  // Fetch profile info

  const fetchProfileInfo = async () => {
    if (!currentUser.rest._id) {
      console.error("currentUser.rest._id is undefined");
      return;
    }

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/profile/${currentUser.rest._id}`,
        {
          withCredentials: true, // Ensure cookies are sent automatically
        }
      );

      //   console.log("data: ", data);
      setUserInfo(data.user);
      setName(data.user.username);
      setEmail(data.user.email);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to fetch profile info"
      );
    }
  };

  // Update profile
  const handleProfileUpdate = async () => {
    console.log(`${API_BASE_URL}/profile/${currentUser.rest._id}`);
    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/profile/${currentUser.rest._id}`,
        {
          username: name,
          email,
        },
        {
          withCredentials: true, // Ensure cookies are sent automatically
        }
      );
      setUserInfo(data.user);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  // Update password
  const handlePasswordUpdate = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/profile/password/${userInfo._id}`,
        {
          oldPassword,
          newPassword,
        },
        {
          withCredentials: true, // Ensure cookies are sent automatically
        }
      );
      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    }
  };

  useEffect(() => {
    if (!currentUser || !currentUser.rest) {
      navigate("/login");
    } else {
      setUserInfo(currentUser.rest);
      fetchProfileInfo();
    }
  }, [currentUser, navigate]);

  if (!userInfo) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-6">Profile Page</h1>
        <div className="bg-white rounded shadow p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 mb-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleProfileUpdate}
          >
            Update Profile
          </button>
        </div>

        <div className="bg-white rounded shadow p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700">
              Old Password
            </label>
            <input
              type={showOldPassword ? "text" : "password"}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 mb-2"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 mb-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handlePasswordUpdate}
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
