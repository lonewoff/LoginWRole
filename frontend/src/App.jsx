import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import RegisterAdmin from "./RegisterAdmin";
import RegisterClient from "./RegisterClient";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Dashboard1 from "./Dashboard1";
import Dashboard2 from "./Dashboard2";
import Dashboard3 from "./Dashboard3";
import Dashboard4 from "./Dashboard4";
import Home from "./Home";
import BookingForm from "./BookingForm";
import BookingDetails from "./BookingDetails";
import ClientDashboard from "./ClientDashboard";

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role?.toLowerCase())) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register-admin" element={<RegisterAdmin />} />
        <Route path="/register-client" element={<RegisterClient />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/staff" element={<Dashboard1 />} />
        <Route path="/staff2" element={<Dashboard2 />} />
        <Route path="/staff3" element={<Dashboard3 />} />
        <Route path="/staff4" element={<Dashboard4 />} />
        <Route 
          path="/booking" 
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <BookingForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/booking-details" 
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <BookingDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/client-dashboard" 
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ClientDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;