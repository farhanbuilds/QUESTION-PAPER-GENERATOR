import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import UploadForm from "./components/UploadForm";
import ViewData from "./components/ViewData";

function App() {
  return (
    <>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<UploadForm />} />
            <Route path="/view/:dataId" element={<ViewData />} />  {/* Corrected component name */}
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
