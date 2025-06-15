import { useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Box } from "@mui/material";

const initialDestinations = [
  { id: 1, name: "Paris, France", price: 1200 },
  { id: 2, name: "Tokyo, Japan", price: 2000 },
  { id: 3, name: "New York, USA", price: 1500 },
  { id: 4, name: "Sydney, Australia", price: 1800 },
  { id: 5, name: "Rome, Italy", price: 1100 },
];

const ManageDestinations = () => {
  const [destinations, setDestinations] = useState(initialDestinations);
  const [newDestination, setNewDestination] = useState({ name: "", price: "" });
  const [editId, setEditId] = useState(null);
  const [editDestination, setEditDestination] = useState({ name: "", price: "" });

  const handleAdd = () => {
    if (!newDestination.name || !newDestination.price) return;
    setDestinations([
      ...destinations,
      { id: Date.now(), name: newDestination.name, price: Number(newDestination.price) },
    ]);
    setNewDestination({ name: "", price: "" });
  };

  const handleEdit = (id) => {
    const dest = destinations.find((d) => d.id === id);
    setEditId(id);
    setEditDestination({ name: dest.name, price: dest.price });
  };

  const handleSave = (id) => {
    setDestinations(destinations.map((d) => d.id === id ? { ...d, ...editDestination } : d));
    setEditId(null);
    setEditDestination({ name: "", price: "" });
  };

  const handleDelete = (id) => {
    setDestinations(destinations.filter((d) => d.id !== id));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Manage Destinations</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField label="Destination Name" value={newDestination.name} onChange={e => setNewDestination({ ...newDestination, name: e.target.value })} />
        <TextField label="Price" type="number" value={newDestination.price} onChange={e => setNewDestination({ ...newDestination, price: e.target.value })} />
        <Button variant="contained" onClick={handleAdd}>Add</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {destinations.map((d) => (
              <TableRow key={d.id}>
                <TableCell>
                  {editId === d.id ? (
                    <TextField value={editDestination.name} onChange={e => setEditDestination({ ...editDestination, name: e.target.value })} />
                  ) : (
                    d.name
                  )}
                </TableCell>
                <TableCell>
                  {editId === d.id ? (
                    <TextField type="number" value={editDestination.price} onChange={e => setEditDestination({ ...editDestination, price: e.target.value })} />
                  ) : (
                    d.price
                  )}
                </TableCell>
                <TableCell>
                  {editId === d.id ? (
                    <Button onClick={() => handleSave(d.id)}>Save</Button>
                  ) : (
                    <Button onClick={() => handleEdit(d.id)}>Edit</Button>
                  )}
                  <Button color="error" onClick={() => handleDelete(d.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ManageDestinations; 