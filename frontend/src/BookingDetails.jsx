import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BookingDetails = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestBooking = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/bookings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data && response.data.length > 0) {
          // Get the most recent booking
          setBooking(response.data[0]);
        }
      } catch (err) {
        setError("Failed to fetch booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBooking();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">No booking found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Booking Confirmation
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: "grey.100" }}>
                <Typography variant="h6" gutterBottom>
                  Booking Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Booking ID
                    </Typography>
                    <Typography variant="body1">{booking.booking_id}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Status
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: booking.booking_status === 'confirmed' ? 'success.main' : 'warning.main',
                      textTransform: 'capitalize'
                    }}>
                      {booking.booking_status}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Destination
                    </Typography>
                    <Typography variant="body1">{booking.destination}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Travel Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date(booking.travel_date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  {booking.return_date && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" color="text.secondary">
                        Return Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(booking.return_date).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Number of Travelers
                    </Typography>
                    <Typography variant="body1">{booking.travelers}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Total Amount
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      ${booking.total_amount}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Payment Status
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: booking.payment_status === 'completed' ? 'success.main' : 'warning.main',
                      textTransform: 'capitalize'
                    }}>
                      {booking.payment_status}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/dashboard")}
                >
                  Back to Dashboard
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => window.print()}
                >
                  Print Booking Details
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookingDetails; 