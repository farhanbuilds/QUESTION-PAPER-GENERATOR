import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import "./App.css";
import UploadForm from "./components/UploadForm.tsx";
import ViewData from "./components/ViewData.jsx";
import Home from "./Home.tsx";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadForm />} />
          <Route path="/view/:dataId" element={<ViewData />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
