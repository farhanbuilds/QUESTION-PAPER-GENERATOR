import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref,get, set } from "firebase/database";
import { auth, db } from "../firebaseConfig.js";
import {
  BarChart3,
  Bell,
  Brain,
  Clock,
  DownloadIcon,
  FileText,
  Grid,
  Layout,
  LogOut,
  Plus,
  Settings2,
  Star,
  TrendingUp,
  Users
} from 'lucide-react';
import SkeletonCard from "../components/SkeletonCard";

const Dashboard = () => {
    const [currentUser, setCurrentUser] = useState({});
    const [userPdfs, setUserPdfs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [logoutPopup, setLogoutPopup] = useState(false);
    const [profilePic, setProfilePic] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkXzsztRhsJQRJSSsLJzqPAp_f7yyr0BL51Q&s");
    const navigate = useNavigate();
    const [userStats] = useState({
        papersGenerated: 24,
       totalQuestions: 480,
       averageScore: 4.8,
       activeUsers: 12
     });

  const [popularTemplates] = useState([
    {
      id: 1,
      name: "Standard Mid-Term",
      uses: 128,
      rating: 4.8
    },
    {
      id: 2,
      name: "Quick Quiz",
      uses: 95,
      rating: 4.6
    },
    {
      id: 3,
      name: "Final Exam",
      uses: 156,
      rating: 4.9
    }
  ]);

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setCurrentUser(user);
            setLoading(false);
        }else {
            setCurrentUser(null);
            setUserPdfs([]);
            navigate("/login");
        }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
        const fetchUserPdfs = async () => {
            setLoading(true);
            try {
                const pdfsRef = ref(db, "pdfs");
                const snapshot = await get(pdfsRef);
                const profileRef = ref(db, `users/${currentUser.uid}/profilePic`);
                const profileSnapshot = await get(profileRef);

                if (snapshot.exists()) {
                  const pdfsData = snapshot.val();
                  const userPdfs = Object.values(pdfsData).filter((pdf) => pdf.userId === currentUser.uid ); 
                  setUserPdfs(userPdfs);
               }else {
                setUserPdfs([]);
               }

               if (profileSnapshot.exists()) {
                  const profilePicData = profileSnapshot.val();
                  if (profilePicData) {
                      setProfilePic(profilePicData);
                  }
                }
            } catch (error) {
              console.error("Error fetching PDFs :", error);
            } finally {
              setLoading(false);
            } 
        };
        fetchUserPdfs();
    }
  }, [currentUser]);

  const handlePdfDownload = (base64, fileName) => {
    const link = document.createElement("a");
    link.href = base64;
    link.download = fileName;
    link.click();
  };

  const handleAverageRating = (userPdfs) => {
    if (userPdfs && userPdfs.length > 0){
      let ratingSum = 0;
      console.log(ratingSum);
      userPdfs.forEach((paper) => {
        ratingSum += paper.rating;
        console.log(ratingSum);
      })
      console.log(ratingSum);
      const averageRating = ratingSum / userPdfs.length;
      console.log("average",averageRating);
      return averageRating.toFixed(1);
    }else{
      return 0;
    }
    
  }

  if(userPdfs.length > 0){
    console.log("handle average",handleAverageRating(userPdfs));
  }

  const handleLogout = async () => {
    try {
        await signOut(auth);
        navigate("/login");
    } catch(error) {
        console.error("Error logging out :", error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    
    const year =date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2,"0");

    return `${year}-${month}-${day}`;
  };

  return (
   
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Unreal Heroes</span>
            </div>
            <div className="flex items-center space-x-4">
              
              <button 
                onClick={() => setLogoutPopup(true)}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>

              { logoutPopup && (
               <div className="absolute top-16 mt-2 bg-white shadow-lg rounded-lg p-4 w-40 border border-gray-200">
              <p className="text-sm text-gray-700">Are you sure you want to log out?</p>
              <div className="flex justify-between mt-3">
              <button 
                onClick={handleLogout} 
                className="text-sm text-red-500 hover:text-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => setLogoutPopup(false)} 
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                No
              </button>
            </div>
          </div>
           )}  

              <div className="flex items-center space-x-3">
                <img
                  className="h-8 w-8 rounded-full bg-gray-200"
                  src={profilePic}
                  alt="User avatar"
                />
                <span className="text-sm font-medium text-black max-sm:hidden">{currentUser.displayName}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <FileText className="h-8 w-8 text-indigo-600" />
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm font-medium text-gray-500">Papers Generated</p>
            <p className="text-2xl font-bold text-gray-900">{userPdfs.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Brain className="h-8 w-8 text-indigo-600" />
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm font-medium text-gray-500">Total Questions</p>
            <p className="text-2xl font-bold text-gray-900">{userPdfs.length * 20}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Star className="h-8 w-8 text-indigo-600" />
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm font-medium text-gray-500">Average Rating</p>
            <p className="text-2xl font-bold text-gray-900">{handleAverageRating(userPdfs)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-indigo-600" />
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm font-medium text-gray-500">Active Users</p>
            <p className="text-2xl font-bold text-gray-900">{userStats.activeUsers}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button onClick={() => navigate("/upload")} className="flex flex-col items-center p-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
                  <Plus className="h-6 w-6 text-indigo-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">New Paper</span>
                </button>
                <button className="flex flex-col items-center p-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
                  <Layout className="h-6 w-6 text-indigo-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Templates</span>
                </button>
                <button className="flex flex-col items-center p-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
                  <BarChart3 className="h-6 w-6 text-indigo-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Analytics</span>
                </button>
                <button className="flex flex-col items-center p-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
                  <Settings2 className="h-6 w-6 text-indigo-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">Settings</span>
                </button>
              </div>
            </div>

            {/* Recent Papers */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Papers</h2>
                { !(userPdfs.length === 0) && <a href="/viewallpdfs">
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  View All
                </button>
                </a>}
              </div>
              <div className="space-y-4">
                {loading && 
                <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                </>
                }
                { !loading && userPdfs.slice(-3).reverse().map((paper) => (
                  <div key={paper.userId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <FileText className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{paper.name}</h3>
                        <p className="text-sm text-gray-500">{paper.subject}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="flex items-center text-xs text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDate(paper.uploadedAt)}
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            <Brain className="h-4 w-4 mr-1" />
                            {paper.questionsLength} questions
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            <Star className="h-4 w-4 mr-1" />
                            {paper.rating} 
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handlePdfDownload(paper.content, paper.name)} className="p-2 text-gray-400 hover:text-gray-500">
                        <DownloadIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}

                  { !loading && userPdfs.length === 0 && <h2 className="text-black"> You have not Generated any pdf. <a href="/upload" className="text-blue-800">Click here to Generate now</a></h2> }

              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* User Profile */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <img
                  className="h-20 w-20 rounded-full mx-auto mb-4"
                  src={profilePic}
                  alt="User avatar"
                />
                <h2 className="text-xl font-semibold text-gray-900">{currentUser.displayName}</h2>
                <p className="text-sm text-gray-500">{currentUser.email}</p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{userPdfs.length}</p>
                  <p className="text-sm text-gray-500">Papers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{handleAverageRating(userPdfs)}</p>
                  <p className="text-sm text-gray-500">Rating</p>
                </div>
              </div>
              <a href="/editprofile">
              <button className="w-full mt-6 bg-indigo-50 text-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-100 transition-colors">
                Edit Profile
              </button>
              </a>
            </div>

            {/* Popular Templates */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Templates</h2>
              <div className="space-y-4">
                {popularTemplates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-50 rounded-lg">
                        <Layout className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{template.name}</p>
                        <p className="text-xs text-gray-500">{template.uses} uses</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600">{template.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ); 
};

export default Dashboard;