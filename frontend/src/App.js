import { BrowserRouter as Router, Route, Routes, useLocation} from "react-router-dom";
import "./App.css";
import UploadForm from "./components/UploadForm.tsx";
import ViewData from "./components/ViewData.jsx";
import Home from "./Home.tsx";
import { FloatingNav } from "./components/FloatingNav.tsx";
import { Header } from "./components/Header.tsx";

function App() {
  return (
    <Router>
      <div>
        <Header />
        <ConditionalFloatingNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadForm />} />
          <Route path="/view/:dataId" element={<ViewData />} />
        </Routes>
      </div>
    </Router>
  );
}
function ConditionalFloatingNav() {
  const location = useLocation();
  return location.pathname === '/' ? <FloatingNav /> : null;
}

export default App;
