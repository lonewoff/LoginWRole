import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Typography, Button, Alert } from "@mui/material";

const Dashboard4 = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [userRole, setRole] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Retrieve the user and role from localStorage
    const storedUser = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    console.log("Stored User:", storedUser); // Debugging log
    console.log("Stored Role:", storedRole); // Debugging log

    setUser(storedUser);
    setRole(storedRole);

    if (!storedUser || !storedRole) {
      setError("No user or role found. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (storedRole.toLowerCase() !== "staff4") {
      setError(`Role mismatch: expected 'staff4', got '${storedRole}'. Redirecting to login...`);
      setTimeout(() => navigate("/login"), 2000);
    }
  }, [navigate]);

  return (
    <Container>
      <Typography variant="h4">
        Welcome {userRole} {user}
      </Typography>
      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
      <Typography variant="body2" color="text.secondary">[Debug] Username: {user} | Role: {userRole}</Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          // Clear localStorage and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("role");
          navigate("/login");
        }}
      >
        Logout
      </Button>
      <br /><br />
      <Button component={Link} to="/all-bookings" variant="outlined" sx={{ mr: 1 }}>All Bookings</Button>
      <Button component={Link} to="/print-report" variant="outlined" sx={{ mr: 1 }}>Print Report</Button>
      <Button component={Link} to="/receipt" variant="outlined">Receipt</Button>
    </Container>
  );
};

export default Dashboard4;