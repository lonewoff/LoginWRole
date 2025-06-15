import { useEffect, useState } from "react";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from "@mui/material";

const PrintReport = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookings", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <Container sx={{ mt: 4 }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Print Report</Typography>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((b) => (
              <TableRow key={b.booking_id}>
                <TableCell>{b.booking_id}</TableCell>
                <TableCell>{b.username || b.client || 'N/A'}</TableCell>
                <TableCell>{b.destination}</TableCell>
                <TableCell>{b.travel_date}{b.return_date ? ` to ${b.return_date}` : ''}</TableCell>
                <TableCell>{b.booking_status}</TableCell>
                <TableCell>{b.total_amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" onClick={() => window.print()}>
        Print This Page
      </Button>
    </Container>
  );
};

export default PrintReport;