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
import { Person } from "@mui/icons-material";

const RegisterClient = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    
    if (!username || !password || !confirmPassword || !email || !fullName) {
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

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/register", 
        { 
          username, 
          password, 
          role: "Client", // Fixed role for clients
          email,
          fullName 
        }, 
        { headers: { "Content-Type": "application/json" } }
      );
      
      alert("Client registration successful!");
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
          <Person sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
          <Typography variant="h4" component="h1" color="secondary">
            Client Registration
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField 
          label="Full Name" 
          fullWidth 
          margin="normal" 
          value={fullName} 
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <TextField 
          label="Email Address" 
          type="email"
          fullWidth 
          margin="normal" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required
        />

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

        <Button 
          variant="contained" 
          color="secondary" 
          fullWidth 
          onClick={handleRegister}
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? "Registering..." : "Register as Client"}
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

export default RegisterClient;