import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  School,
  GraduationCap,
  Upload,
  ChevronDown,
  FileUp,
  Sparkles,
} from "lucide-react";
import Footer from "./Footer.jsx";

const bloomLevels = [
  {
    value: "remember",
    label: "Remember",
    description: "Recall facts and basic concepts",
  },
  {
    value: "understand",
    label: "Understand",
    description: "Explain ideas or concepts",
  },
  {
    value: "apply",
    label: "Apply",
    description: "Use information in new situations",
  },
  {
    value: "analyze",
    label: "Analyze",
    description: "Draw connections among ideas",
  },
  {
    value: "evaluate",
    label: "Evaluate",
    description: "Justify a stand or decision",
  },
  {
    value: "create",
    label: "Create",
    description: "Produce new or original work",
  },
];

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedPartALevel, setSelectedPartALevel] = useState<string | null>(
    null
  );
  const [selectedPartBLevel, setSelectedPartBLevel] = useState<string | null>(
    null
  );
  const [collegeDetails, setCollegeDetails] = useState({
    name: "",
    university: "",
    program: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoFormat, setLogoFormat] = useState<string | null>(null);
  const [questionPaperName, setQuestionPaperName] = useState("");
  const [subject, setSubject] = useState("");
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [isPartASelectOpen, setIsPartASelectOpen] = useState(false);
  const [isPartBSelectOpen, setIsPartBSelectOpen] = useState(false);

  const [loading, setLoading] = useState(false); // Loading state
  const [showIncompletePopup, setShowIncompletePopup] = useState(false); // Popup state
  const [showFilePopup, setShowFilePopup] = useState(false); // Popup state
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;

    console.log("selected file", selectedFile);
    if (
      selectedFile &&
      selectedFile.type !== "application/pdf" &&
      selectedFile.type !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setShowFilePopup(true); // Show popup if file type is invalid
      setFile(null); // Clear the file input
    } else {
      setFile(selectedFile);
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setLogoFile(file);
      const fileType = file.type.split("/")[1].toUpperCase();
      setLogoFormat(fileType);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCollegeDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCollegeDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedPartALevel || !selectedPartBLevel) {
      setShowIncompletePopup(true); // Show popup if file or level is not selected
      return;
    }

    console.log("Generating with:", {
      file,
      levelA: selectedPartALevel,
      levelB: selectedPartBLevel,
      collegeDetails,
      logo: logoFile,
    });
    console.log("Generate content with:", {
      file,
      levelA: selectedPartALevel,
      levelB: selectedPartBLevel,
    });
    setLoading(true); // Set loading to true

    let logoBase64 = "";

    try {
      if (logoFile) {
        logoBase64 = await convertFileToBase64(logoFile);
      }
    } catch (error) {
      console.error("Error converting logo to base64:", error);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("selectedPartALevel", selectedPartALevel); // Include the selected Bloom's level for PART A
    formData.append("selectedPartBLevel", selectedPartBLevel); // Include the selected Bloom's level for PART B
    formData.append("logoBase64", logoBase64 || "");
    formData.append("logoFormat", logoFormat || "");
    formData.append("collegeName", collegeDetails.name);
    formData.append("affilatedUniversity", collegeDetails.university);
    formData.append("program", collegeDetails.program);
    formData.append("questionPaperName", questionPaperName);
    formData.append("subject", subject);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        const data = response.data;
        const dataId = data.dataId; // Assuming the response contains a dataId
        navigate(`/view/${dataId}`); // Pass the selected level and college details as query parameters
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false); // Set loading to false after upload is complete
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col justify-center">
        <div className="flex flex-col justify-center">
          <div className="container mx-auto px-4 py-16 flex-grow">
            <div className="max-w-2xl mx-auto">
              {/* Main Content */}
              <h1 className="mb-5 text-4xl font-bold text-center">
                Question Paper Generator
              </h1>
              <p className="text-lg text-gray-600 font-medium mb-8 text-center">
                Upload your Question Bank PDF or DOCX and select Bloom's level
                to generate question paper
              </p>
              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <div className="mb-8 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* College Logo Upload */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        College Logo
                      </label>
                      <div className="relative">
                        <label
                          htmlFor="logo-upload"
                          className="flex h-[46px] w-full rounded-lg border border-gray-300 hover:border-indigo-400 cursor-pointer transition-colors overflow-hidden group"
                        >
                          <div className="flex items-center w-full">
                            <div className="flex-shrink-0 bg-gray-50 px-3 py-2 border-r border-gray-300 group-hover:border-indigo-400">
                              {logoPreview ? (
                                <img
                                  src={logoPreview}
                                  alt="Preview"
                                  className="w-6 h-6 object-contain"
                                />
                              ) : (
                                <Building2 className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 px-3 py-2 text-sm text-gray-500 truncate">
                              {logoFile ? logoFile.name : "Choose logo..."}
                            </div>
                          </div>
                          <input
                            id="logo-upload"
                            name="logo"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* College Name */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        College Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <School className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={collegeDetails.name}
                          onChange={handleCollegeDetailsChange}
                          placeholder="Enter college name"
                          className="pl-10 w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {/* University */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Affiliated University
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <GraduationCap className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="university"
                          value={collegeDetails.university}
                          onChange={handleCollegeDetailsChange}
                          placeholder="Enter affiliated university"
                          className="pl-10 w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Program */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Program
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FileUp className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="program"
                          value={collegeDetails.program}
                          onChange={handleCollegeDetailsChange}
                          placeholder="Enter program name"
                          className="pl-10 w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Question Paper Name */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question Paper Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FileUp className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="questionpapername"
                          value={questionPaperName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setQuestionPaperName(e.target.value)
                          }
                          placeholder="Enter Question Paper Name"
                          className="pl-10 w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FileUp className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="subject"
                          value={subject}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSubject(e.target.value)}
                          placeholder="Enter program name"
                          className="pl-10 w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                  </div>
                </div>
                {/* File Upload */}
                <div className="mb-8">
                  <label
                    htmlFor="file-upload"
                    className="block w-full cursor-pointer"
                  >
                    <div className="border-2 border-dashed border-indigo-200 rounded-xl p-8 transition-colors hover:border-indigo-300 text-center">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-indigo-500" />
                      <div className="text-lg font-medium text-gray-700 mb-2">
                        {file ? file.name : "Choose a file to upload"}
                      </div>
                      <p className="text-sm text-gray-500">
                        Drop your file here or click to browse
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                {/* Part A Custom Select */}
                <div className="mb-8 relative">
                  <div
                    className="border rounded-xl p-4 cursor-pointer flex items-center justify-between"
                    onClick={() =>
                      setIsPartASelectOpen(
                        !isPartASelectOpen && !isPartBSelectOpen
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      <FileUp className="text-indigo-500" />
                      <span
                        className={
                          selectedPartALevel ? "text-gray-800" : "text-gray-400"
                        }
                      >
                        {selectedPartALevel
                          ? bloomLevels.find(
                              (level) => level.value === selectedPartALevel
                            )?.label
                          : "Select Bloom's Level for Part A"}
                      </span>
                    </div>
                    <ChevronDown
                      className={`transition-transform ${
                        isPartASelectOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {/* Part A Dropdown */}
                  {isPartASelectOpen && (
                    <div className="absolute w-full mt-2 bg-white border rounded-xl shadow-lg z-10">
                      {bloomLevels.slice(0, 2).map((level) => (
                        <div
                          key={level.value}
                          className="p-4 hover:bg-indigo-50 cursor-pointer transition-colors"
                          onClick={() => {
                            setSelectedPartALevel(level.value);
                            setIsPartASelectOpen(false);
                          }}
                        >
                          <div className="font-medium text-gray-800">
                            {level.label}
                          </div>
                          <div className="text-sm text-gray-500">
                            {level.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Part B Custom Select */}
                <div className="mb-8 relative">
                  <div
                    className="border rounded-xl p-4 cursor-pointer flex items-center justify-between"
                    onClick={() =>
                      setIsPartBSelectOpen(
                        !isPartBSelectOpen && !isPartASelectOpen
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      <FileUp className="text-indigo-500" />
                      <span
                        className={
                          selectedPartBLevel ? "text-gray-800" : "text-gray-400"
                        }
                      >
                        {selectedPartBLevel
                          ? bloomLevels.find(
                              (level) => level.value === selectedPartBLevel
                            )?.label
                          : "Select Bloom's Level for Part B"}
                      </span>
                    </div>
                    <ChevronDown
                      className={`transition-transform ${
                        isPartBSelectOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {/* Part B Dropdown */}
                  {isPartBSelectOpen && (
                    <div className="absolute w-full mt-2 bg-white border rounded-xl shadow-lg z-10">
                      {bloomLevels.slice(2, 6).map((level) => (
                        <div
                          key={level.value}
                          className="p-4 hover:bg-indigo-50 cursor-pointer transition-colors"
                          onClick={() => {
                            setSelectedPartBLevel(level.value);
                            setIsPartBSelectOpen(false);
                          }}
                        >
                          <div className="font-medium text-gray-800">
                            {level.label}
                          </div>
                          <div className="text-sm text-gray-500">
                            {level.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Generate Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-indigo-600 text-white rounded-xl py-4 px-6 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors font-medium"
                >
                  <Sparkles className="w-5 h-5" />
                  {loading ? "Uploading..." : "Generate Content"}
                </button>
              </form>
            </div>
          </div>
          {/* Custom Popup */}
          {showIncompletePopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Incomplete Form</h2>
                <p className="mb-4">
                  Please upload a file and select a Bloom's level before
                  proceeding.
                </p>
                <button
                  onClick={() => setShowIncompletePopup(false)}
                  className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {showFilePopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Invalid File Type</h2>
                <p className="mb-4">Please upload a PDF or DOCX.</p>
                <button
                  onClick={() => setShowFilePopup(false)}
                  className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
