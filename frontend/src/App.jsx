import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Register from "./pages/Register";
import AddService from "./pages/AddService";
import TotpList from "./pages/TotpList";
import Verify from "./pages/Verify";

export default function App() {
  return (
    <Router>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1>Speaksy Auth</h1>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/register" style={{ marginRight: "10px" }}>
            Register
          </Link>
          <Link to="/add-service" style={{ marginRight: "10px" }}>
            Add Service
          </Link>
          <Link to="/totp-list">TOTP List</Link>
          <Link to="/verify" style={{ marginLeft: "10px" }}>
            Verify Code
          </Link>
        </nav>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/add-service" element={<AddService />} />
          <Route path="/totp-list" element={<TotpList />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      </div>
    </Router>
  );
}
