import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Alert,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const destinations = [
  { id: 1, name: "Paris, France", price: 1200 },
  { id: 2, name: "Tokyo, Japan", price: 2000 },
  { id: 3, name: "New York, USA", price: 1500 },
  { id: 4, name: "Sydney, Australia", price: 1800 },
  { id: 5, name: "Rome, Italy", price: 1100 },
];

const BookingForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    numberOfGuests: 1,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedDestination = destinations.find(
    (dest) => dest.id === parseInt(formData.destination)
  );

  const totalPrice = selectedDestination
    ? selectedDestination.price * formData.numberOfGuests
    : 0;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const bookingData = {
        destination: selectedDestination.name,
        travelDate: formData.startDate,
        returnDate: formData.endDate,
        travelers: formData.numberOfGuests,
        totalAmount: totalPrice,
        paymentMethod: "card", // Default payment method
      };

      await axios.post(
        "http://localhost:5000/api/bookings",
        bookingData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Booking successful! Thank you for your reservation.");
      navigate("/booking-details");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to process booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Book Your Trip
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
              >
                {destinations.map((destination) => (
                  <MenuItem key={destination.id} value={destination.id}>
                    {destination.name} - ${destination.price}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Number of Guests"
                name="numberOfGuests"
                value={formData.numberOfGuests}
                onChange={handleChange}
                inputProps={{ min: 1 }}
                required
              />
            </Grid>

            {selectedDestination && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: "grey.100" }}>
                  <Typography variant="h6" gutterBottom>
                    Booking Summary
                  </Typography>
                  <Typography>
                    Destination: {selectedDestination.name}
                  </Typography>
                  <Typography>
                    Price per person: ${selectedDestination.price}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Total Price: ${totalPrice}
                  </Typography>
                </Paper>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default BookingForm; 