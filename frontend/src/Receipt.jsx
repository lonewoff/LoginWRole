import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Paper, Button, CircularProgress, Alert } from "@mui/material";

const Receipt = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        setBooking(data);
      } catch (err) {
        setError("Failed to fetch booking");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) return <Container sx={{ mt: 4 }}><CircularProgress /></Container>;
  if (error || !booking) return <Container sx={{ mt: 4 }}><Alert severity="error">{error || "Booking not found"}</Alert></Container>;

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 4, mb: 2 }}>
        <Typography variant="h5" gutterBottom>Receipt</Typography>
        <Typography>Booking ID: {booking.booking_id}</Typography>
        <Typography>Destination: {booking.destination}</Typography>
        <Typography>Amount Paid: ${booking.total_amount}</Typography>
        <Typography>Status: {booking.booking_status}</Typography>
        <Typography>User: {booking.username || booking.user || 'N/A'}</Typography>
        <Typography>Date: {booking.travel_date}{booking.return_date ? ` to ${booking.return_date}` : ''}</Typography>
      </Paper>
      <Button variant="contained" color="primary" onClick={() => window.print()}>
        Print Receipt
      </Button>
    </Container>
  );
};

export default Receipt;