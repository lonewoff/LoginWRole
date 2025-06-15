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
import AllBookings from "./AllBookings";
import AllUsers from "./AllUsers";
import ManageDestinations from "./ManageDestinations";
import PrintReport from "./PrintReport";
import Receipt from "./Receipt";

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  let role = localStorage.getItem("role");
  if (role) role = role.toLowerCase().trim();
  console.log("[ProtectedRoute] token:", token, "role:", role, "allowedRoles:", allowedRoles);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.map(r => r.toLowerCase().trim()).includes(role)) {
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
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/staff" 
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <Dashboard1 />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/staff2" 
          element={
            <ProtectedRoute allowedRoles={["staff2"]}>
              <Dashboard2 />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/staff3" 
          element={
            <ProtectedRoute allowedRoles={["staff3"]}>
              <Dashboard3 />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/staff4" 
          element={
            <ProtectedRoute allowedRoles={["staff4"]}>
              <Dashboard4 />
            </ProtectedRoute>
          } 
        />
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
        <Route 
          path="/all-bookings" 
          element={
            <ProtectedRoute allowedRoles={["admin", "staff", "staff2", "staff3", "staff4"]}>
              <AllBookings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/all-users" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AllUsers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manage-destinations" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageDestinations />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/print-report" 
          element={
            <ProtectedRoute allowedRoles={["admin", "staff", "staff2", "staff3", "staff4", "client"]}>
              <PrintReport />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/receipt" 
          element={
            <ProtectedRoute allowedRoles={["admin", "staff", "staff2", "staff3", "staff4", "client"]}>
              <Receipt />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/receipt/:bookingId" 
          element={
            <ProtectedRoute allowedRoles={["admin", "staff", "staff2", "staff3", "staff4", "client"]}>
              <Receipt />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;