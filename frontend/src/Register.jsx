import { useState } from "react";
import axios from "axios";
import { TextField, Button, Container, Typography, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");
 const [role, setRole] = useState("");
 const navigate = useNavigate();

 const handleRegister = async () => {
 if (!username || !password) {
alert("please fill in all fields");
 return;
 }

 try {
 const response = await axios.post("http://localhost:5000/register", { username, password, role }, { headers: { "Content-Type": "application/json" } });
 alert(response.data.message);
 navigate("/login");
 } catch (error) {
 alert(error.response?.data?.message || "Registration Failed");
 }
};

 return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%" minHeight="100vh">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3, width: 350, boxShadow: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Register
          </Typography>
          <TextField label="Username" fullWidth margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
          <TextField label="Role" fullWidth margin="normal" value={role} onChange={(e) => setRole(e.target.value)} />
          <Button variant="contained" color="primary" fullWidth size="large" sx={{ mt: 2 }} onClick={handleRegister}>
            Register
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;