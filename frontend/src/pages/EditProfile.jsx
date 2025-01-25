import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../firebaseConfig.js";
import {
  Camera,
  Save,
  X,
  EyeOff,
  Eye,
  User,
  Grid,
} from "lucide-react";

const EditProfile = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState(
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400"
  );
  const [isProfileUpdate, setIsProfileUpdate] = useState(false);
  const [isPasswordUpdate, setIsPasswordUpdate] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isNameUpdate, setIsNameUpdate] = useState(false);

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(true);
    const userId = currentUser.uid;
    if (isProfileUpdate ) {
      try {
        await set(ref(db, `users/${userId}`), {
          profilePic: profilePic,
          displayName:name,
        });
      } catch (error) {
        console.error("Error saving profile picture:", error);
      }
    }

    if (isNameUpdate ) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: name,
        }
        )
      } catch (error) {
        console.error("Error saving name:", error);
      }
    }

    if (isPasswordUpdate) {
      try {
        const user = currentUser;
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        console.log("Password updated successfully");
      } catch (error) {
        console.error("Error updating password:", error);
      }
    }

    console.log("Profile updated");
    setIsEditing(false);
    navigate("/dashboard");
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
      const profileBase64 = await convertFileToBase64(file);
      setProfilePic(profileBase64);
      if (profileBase64) {
        setIsProfileUpdate(true);
      }
    }
  };

    useEffect(() => {
      setLoading(true);
      const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            if(user){
              setCurrentUser(user);
              setName(user.displayName)
            }
              setLoading(false);
          }else {
              setCurrentUser({});
              navigate("/login");
          }
      });
      return () => unsubscribe();
    }, [currentUser]);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-start ml-8 h-16">
            <div className="flex items-center">
              <Grid className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Unreal Heroes
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="w-screen flex justify-center items-center">
        <div className="bg-white shadow-xl w-[70vw] rounded-lg overflow-hidden mt-20">
          {/* Header */}
          <div className="px-6 py-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <h1 className="text-3xl font-bold text-white text-center">
              Edit Profile
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <label
                  htmlFor="profile-pic"
                  className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
                >
                  <Camera className="w-5 h-5 text-white" />
                </label>
                <input
                  type="file"
                  id="profile-pic"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <p className="text-sm text-gray-500">
                Click the camera icon to change your profile picture
              </p>
            </div>

            {/* Name Section */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setIsNameUpdate(true)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your full name"
              />
            </div>

            {/* Password Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Change Password
              </h3>
              <div className="space-y-4">
                {/* Current Password */}
                <div className="relative">
                  <label
                    htmlFor="current-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Current Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="relative">
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="new-password"
                      value={newPassword}
                      onChange={(e) => {
                      setNewPassword(e.target.value)
                      setIsPasswordUpdate(true)
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm New Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="flex items-center space-x-2">
                  <X className="w-5 h-5" />
                  <span onClick={()=> navigate("/dashboard")}>Cancel</span>
                </span>
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="flex items-center space-x-2">
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </span>
              </button>
            </div>
          </form>

        </div>
      </div>
      { isEditing && 
      <div className="w-scren h-screen  fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-16 h-16 border-4 border-t-transparent border-x-indigo-500 rounded-full animate-spin">
        </div>
      </div> }
    </div>

    );
};

export default EditProfile;
