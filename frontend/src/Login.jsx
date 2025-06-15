import { useState } from "react";
import axios from "axios";
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Box,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Login as LoginIcon } from "@mui/icons-material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
  
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/login", 
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );
  
      // Store token, username, and role in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("role", response.data.role);
  
      alert("Login successful!");
      // Redirect based on role
      if (response.data.role.toLowerCase() === "client") {
        navigate("/client-dashboard");
      } else if (response.data.role.toLowerCase() === "staff") {
        navigate("/staff");
      } else if (response.data.role.toLowerCase() === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/"); // fallback
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <LoginIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" component="h1" color="primary">
            Login
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
        />
        
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          onClick={handleLogin}
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Button 
            variant="text" 
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Back to Home
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Don't have an account? Register as{" "}
            <Button 
              variant="text" 
              size="small"
              onClick={() => navigate('/register-admin')}
              sx={{ textTransform: 'none' }}
            >
              Admin/Staff
            </Button>
            {" "}or{" "}
            <Button 
              variant="text" 
              size="small"
              onClick={() => navigate('/register-client')}
              sx={{ textTransform: 'none' }}
            >
              Client
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;