import { Container, Typography, Button, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AdminPanelSettings, Person } from "@mui/icons-material";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Welcome to Online Travel And Tours
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Choose your registration type to get started
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              minWidth: 250, 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                elevation: 4,
                transform: 'translateY(-2px)'
              }
            }}
            onClick={() => navigate('/register-admin')}
          >
            <AdminPanelSettings sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Admin/Staff Registration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Register as an administrator or staff member with elevated privileges
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              onClick={() => navigate('/register-admin')}
            >
              Register as Admin/Staff
            </Button>
          </Paper>

          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              minWidth: 250, 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                elevation: 4,
                transform: 'translateY(-2px)'
              }
            }}
            onClick={() => navigate('/register-client')}
          >
            <Person sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Client Registration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Register as a client to access our services and features
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              fullWidth
              onClick={() => navigate('/register-client')}
            >
              Register as Client
            </Button>
          </Paper>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Already have an account?
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/login')}
            sx={{ mt: 1 }}
          >
            Login Here
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Home;