import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Button } from "@mui/material";
import { Link } from "react-router-dom";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/bookings", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBookings(response.data);
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
      <Typography variant="h4" gutterBottom>All Bookings</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Travel Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Receipt</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((b) => (
              <TableRow key={b.booking_id}>
                <TableCell>{b.booking_id}</TableCell>
                <TableCell>{b.username}</TableCell>
                <TableCell>{b.destination}</TableCell>
                <TableCell>{b.travel_date}</TableCell>
                <TableCell>{b.booking_status}</TableCell>
                <TableCell>{b.total_amount}</TableCell>
                <TableCell>
                  <Button component={Link} to={`/receipt/${b.booking_id}`} variant="outlined" size="small">
                    View Receipt
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AllBookings;