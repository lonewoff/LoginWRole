import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegisterAdmin from "./RegisterAdmin";
import RegisterClient from "./RegisterClient";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Dashboard1 from "./Dashboard1";
import Dashboard2 from "./Dashboard2";
import Dashboard3 from "./Dashboard3";
import Dashboard4 from "./Dashboard4";
import Home from "./Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register-admin" element={<RegisterAdmin />} />
        <Route path="/register-client" element={<RegisterClient />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/staff" element={<Dashboard1 />} />
        <Route path="/staff2" element={<Dashboard2 />} />
        <Route path="/staff3" element={<Dashboard3 />} />
        <Route path="/staff4" element={<Dashboard4 />} />
      </Routes>
    </Router>
  );
}

export default App;