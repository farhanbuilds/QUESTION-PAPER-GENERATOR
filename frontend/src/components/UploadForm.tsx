import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload, ChevronDown, FileUp, Sparkles } from 'lucide-react';
import Footer from './Footer.jsx';

const bloomLevels = [
  { value: 'remember', label: 'Remember', description: 'Recall facts and basic concepts' },
  { value: 'understand', label: 'Understand', description: 'Explain ideas or concepts' },
  { value: 'apply', label: 'Apply', description: 'Use information in new situations' },
  { value: 'analyze', label: 'Analyze', description: 'Draw connections among ideas' },
  { value: 'evaluate', label: 'Evaluate', description: 'Justify a stand or decision' },
  { value: 'create', label: 'Create', description: 'Produce new or original work' }
];

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedPartALevel, setSelectedPartALevel] = useState<string | null>(null);
  const [selectedPartBLevel, setSelectedPartBLevel] = useState<string | null>(null);
  const [isPartASelectOpen, setIsPartASelectOpen] = useState(false);
  const [isPartBSelectOpen, setIsPartBSelectOpen] = useState(false);

  const [loading, setLoading] = useState(false);  // Loading state
  const [showIncompletePopup, setShowIncompletePopup] = useState(false); // Popup state
  const [showFilePopup, setShowFilePopup] = useState(false); // Popup state
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;

    console.log('selected file', selectedFile);
    if (selectedFile && (selectedFile.type !== 'application/pdf' && selectedFile.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setShowFilePopup(true); // Show popup if file type is invalid
      setFile(null);  // Clear the file input
    } else {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedPartALevel || !selectedPartBLevel) {
      setShowIncompletePopup(true); // Show popup if file or level is not selected
      return;
    }
    console.log('Generate content with:', { file, levelA: selectedPartALevel, levelB: selectedPartBLevel });
    setLoading(true);  // Set loading to true
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('levelA', selectedPartALevel); // Include the selected Bloom's level for PART A
    formData.append('levelB', selectedPartBLevel); // Include the selected Bloom's level for PART B
  
    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 200) {
        const data = response.data;
        const dataId = data.dataId; // Assuming the response contains a dataId
        navigate(`/view/${dataId}?levelA=${selectedPartALevel}&levelB=${selectedPartBLevel}`); // Pass the selected level as a query parameter    
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);  // Set loading to false after upload is complete
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col justify-center">
    <div className="flex flex-col justify-center">
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-2xl mx-auto">
          {/* Main Content */}
          <h1 className="mb-5 text-4xl font-bold text-center">Question Paper Generator</h1>
          <p className="text-lg text-gray-600 font-medium mb-8 text-center">Upload your Question Bank PDF or DOCX and select Bloom's level to generate question paper</p>
          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
            {/* File Upload */}
            <div className="mb-8">
              <label 
                htmlFor="file-upload"
                className="block w-full cursor-pointer"
              >
                <div className="border-2 border-dashed border-indigo-200 rounded-xl p-8 transition-colors hover:border-indigo-300 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-indigo-500" />
                  <div className="text-lg font-medium text-gray-700 mb-2">
                    {file ? file.name : 'Choose a file to upload'}
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
                onClick={() => setIsPartASelectOpen(!isPartASelectOpen && !isPartBSelectOpen)}
              >
                <div className="flex items-center gap-3">
                  <FileUp className="text-indigo-500" />
                  <span className={selectedPartALevel ? 'text-gray-800' : 'text-gray-400'}>
                    {selectedPartALevel ? bloomLevels.find(level => level.value === selectedPartALevel)?.label : 'Select Bloom\'s Level for Part A'}
                  </span>
                </div>
                <ChevronDown className={`transition-transform ${isPartASelectOpen ? 'rotate-180' : ''}`} />
              </div>
              {/* Part A Dropdown */}
              {isPartASelectOpen && (
                <div className="absolute w-full mt-2 bg-white border rounded-xl shadow-lg z-10">
                  {bloomLevels.slice(0,2).map((level) => (
                    <div
                      key={level.value}
                      className="p-4 hover:bg-indigo-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedPartALevel(level.value);
                        setIsPartASelectOpen(false);
                      }}
                    > 
                      <div className="font-medium text-gray-800">{level.label}</div>
                      <div className="text-sm text-gray-500">{level.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

             {/* Part B Custom Select */}
             <div className="mb-8 relative">
              <div 
                className="border rounded-xl p-4 cursor-pointer flex items-center justify-between"
                onClick={() => setIsPartBSelectOpen(!isPartBSelectOpen && !isPartASelectOpen)}
              >
                <div className="flex items-center gap-3">
                  <FileUp className="text-indigo-500" />
                  <span className={selectedPartBLevel ? 'text-gray-800' : 'text-gray-400'}>
                    {selectedPartBLevel ? bloomLevels.find(level => level.value === selectedPartBLevel)?.label : 'Select Bloom\'s Level for Part B'}
                  </span>
                </div>
                <ChevronDown className={`transition-transform ${isPartBSelectOpen ? 'rotate-180' : ''}`} />
              </div>
              {/* Part B Dropdown */}
              {isPartBSelectOpen && (
                <div className="absolute w-full mt-2 bg-white border rounded-xl shadow-lg z-10">
                  {bloomLevels.slice(2,6).map((level) => (
                    <div
                      key={level.value}
                      className="p-4 hover:bg-indigo-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedPartBLevel(level.value);
                        setIsPartBSelectOpen(false);
                      }}
                    >
                      <div className="font-medium text-gray-800">{level.label}</div>
                      <div className="text-sm text-gray-500">{level.description}</div>
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
            { loading ? "Uploading..." : "Generate Content"}
            </button>
          </form>
        </div>
      </div>
      {/* Custom Popup */}
      {showIncompletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Incomplete Form</h2>
            <p className="mb-4">Please upload a file and select a Bloom's level before proceeding.</p>
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