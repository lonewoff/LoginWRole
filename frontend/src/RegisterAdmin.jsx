import { useState } from "react";
import axios from "axios";
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AdminPanelSettings } from "@mui/icons-material";

const RegisterAdmin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const adminRoles = [
    { value: "admin", label: "Administrator" },
    { value: "staff", label: "Staff Level 1" },
    { value: "staff2", label: "Staff Level 2" },
    { value: "staff3", label: "Staff Level 3" },
    { value: "staff4", label: "Staff Level 4" }
  ];

  const handleRegister = async () => {
    setError("");
    
    if (!username || !password || !confirmPassword || !role) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/register", 
        { username, password, role }, 
        { headers: { "Content-Type": "application/json" } }
      );
      
      alert(`${role} registration successful!`);
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <AdminPanelSettings sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" component="h1" color="primary">
            Admin/Staff Registration
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField 
          label="Username" 
          fullWidth 
          margin="normal" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <TextField 
          label="Password" 
          type="password" 
          fullWidth 
          margin="normal" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required
          helperText="Password must be at least 6 characters"
        />
        
        <TextField 
          label="Confirm Password" 
          type="password" 
          fullWidth 
          margin="normal" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            label="Role"
            onChange={(e) => setRole(e.target.value)}
          >
            {adminRoles.map((roleOption) => (
              <MenuItem key={roleOption.value} value={roleOption.value}>
                {roleOption.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          onClick={handleRegister}
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? "Registering..." : "Register"}
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Button 
            variant="text" 
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Back to Home
          </Button>
          <Button 
            variant="text" 
            onClick={() => navigate('/login')}
          >
            Already have an account? Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterAdmin;