import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref,get } from "firebase/database";
import { auth, db } from "../firebaseConfig.js";
import {
  Bell,
  Brain,
  Clock,
  DownloadIcon,
  FileText,
  Grid,
  LogOut,
} from 'lucide-react';
import SkeletonCard from "../components/SkeletonCard";

const ViewAllPdf = () => {
    const [currentUser, setCurrentUser] = useState({});
    const [userPdfs, setUserPdfs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [logoutPopup, setLogoutPopup] = useState(false);
    const navigate = useNavigate();

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
              <Grid className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Unreal Heroes</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>
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
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkXzsztRhsJQRJSSsLJzqPAp_f7yyr0BL51Q&s"
                  alt="User avatar"
                />
                <span className="text-sm font-medium text-black max-sm:hidden">{currentUser.displayName}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="space-y-8">

            <a href="/dashboard">
                <button className="bg-white rounded-xl shadow-sm p-4">Back To Dashboard</button>
            </a>


            {/* Recent Papers */}
            <div className="w-screen flex justify-center">
            <div className="bg-white rounded-xl w-[60vw] shadow-sm p-6">
              <div className="flex items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Papers</h2>
              </div>
              <div className="space-y-4">
                {loading && 
                <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                </>
                }
                { !loading && userPdfs.slice().reverse().map((paper) => (
                  <div key={paper.userId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-8">
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
          </div>

          
        </div>
      </div>
    </div>
  ); 
};

export default ViewAllPdf;