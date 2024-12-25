import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // Loading state
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    console.log('selected file', selectedFile);
    if (selectedFile && (selectedFile.type !== 'application/pdf' && selectedFile.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setError('Please upload a valid PDF or DOCX file');
      setFile(null);  // Clear the file input
    } else {
      setError(''); // Clear any previous errors
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please Upload a File!');
      return;
    }

    setLoading(true);  // Set loading to true

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://question-paper-generator-cpwx.onrender.com/upload', formData, {
        headers: { 'Content-type': 'multipart/form-data' },
      });

      if (response.data && response.data.dataId) {
        // Redirect to the new page where data can be displayed
        navigate(`/view/${response.data.dataId}`);
      } else {
        setError('Failed to extract data from the file');
      }
    } catch (err) {
      setError(`Failed to upload file: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);  // Reset loading state
    }
  };

  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center  bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="">
          <h1 className="text-white font-bold text-2xl text-center">
            Generate Question Paper by uploading Question Bank
          </h1>

          <p className="text-gray-300 text-center mt-5">
            Upload a question bank pdf or docx file to generate a question
            paper
          </p>
          <div className="flex items-center flex-col gap-2 justify-center max-w-full mt-5 ">
            <form
              className="bg-gray-900 shadow-lg border border-gray-300 rounded-2xl p-8 text-center  max-w-sm"
              onSubmit={handleSubmit}
            >
              <span className="text-white text-2xl font-medium">
                Upload your file
              </span>
              <p className="mt-3 text-sm text-gray-300">
                File should be a PDF or DOCX file
              </p>
              <label
                htmlFor="file-input"
                className="mt-8 flex flex-col items-center justify-center gap-3 p-4 rounded-lg border-2 border-dashed border-blue-300 text-gray-700 cursor-pointer transition-all duration-200 hover:bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 hover:border-gray-600 "
              >
                <span className="text-lg font-bold text-gray-200 hover:text-gray-800">
                  Drop files here
                </span>
                <span>or</span>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  required
                  id="file-input"
                  className="block w-full max-w-xs text-gray-700 p-2 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 file:py-2 file:px-4 file:rounded-lg file:border-none file:bg-blue-600 file:text-white file:font-medium file:cursor-pointer file:transition-all file:duration-200 hover:file:bg-blue-700"
                  onChange={handleFileChange}
                />
              </label>
              <button
                type="submit"
                className="bg-blue-700 p-2 text-white text-xl rounded-xl mt-5"
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Generate'}
              </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
}
