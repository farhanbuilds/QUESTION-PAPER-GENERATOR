import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref,get } from "firebase/database";
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

const Dashboard = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userPdfs, setUserPdfs] = useState([]);
    const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setCurrentUser(user);
        }else {
            setCurrentUser(null);
            setUserPdfs([]);
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

                if (snapshot.exists()) {
                   const pdfsData = snapshot.val();
                   const userPdfs = Object.values(pdfsData).filter((pdf) => pdf.userId === currentUser.uid ); 
                   setUserPdfs(userPdfs);
                }else {
                    setUserPdfs([]);
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

  

  const handleLogout = async () => {
    try {
        await signOut(auth);
        navigate("/login");
    } catch(error) {
        console.error("Error logging out :", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Grid className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">QuestionPro</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
              <div className="flex items-center space-x-3">
                <img
                  className="h-8 w-8 rounded-full bg-gray-200"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User avatar"
                />
                <span className="text-sm font-medium text-gray-700">{currentUser.displayName}</span>
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
            <p className="text-2xl font-bold text-gray-900">{userStats.papersGenerated}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Brain className="h-8 w-8 text-indigo-600" />
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm font-medium text-gray-500">Total Questions</p>
            <p className="text-2xl font-bold text-gray-900">{userStats.totalQuestions}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <Star className="h-8 w-8 text-indigo-600" />
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm font-medium text-gray-500">Average Rating</p>
            <p className="text-2xl font-bold text-gray-900">{userStats.averageScore}</p>
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
                <a href="/upload">
                <button className="flex flex-col items-center p-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
                  <Plus className="h-6 w-6 text-indigo-600 mb-2" />
                  <span className="text-sm font-medium text-gray-700">New Paper</span>
                </button>
                </a>
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
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {userPdfs.map((paper) => (
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
                            {paper.uploadedAt}
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            <Brain className="h-4 w-4 mr-1" />
                            {paper.questionsLength} questions
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
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User avatar"
                />
                <h2 className="text-xl font-semibold text-gray-900">{currentUser.displayName}</h2>
                <p className="text-sm text-gray-500">{currentUser.email}</p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{userStats.papersGenerated}</p>
                  <p className="text-sm text-gray-500">Papers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{userStats.averageScore}</p>
                  <p className="text-sm text-gray-500">Rating</p>
                </div>
              </div>
              <button className="w-full mt-6 bg-indigo-50 text-indigo-600 py-2 px-4 rounded-lg hover:bg-indigo-100 transition-colors">
                Edit Profile
              </button>
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