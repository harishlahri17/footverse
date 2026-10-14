import React from 'react';
import { 
    Box, Container, Typography, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Paper, Button, IconButton, Rating
} from '@mui/material';
import { DeleteOutlined, ShoppingCart } from '@mui/icons-material';
import { useCompare } from '../../store/CompareContext';
import { Link as RouterLink } from 'react-router-dom';

export default function Compare() {
    const { compareItems, removeFromCompare, clearCompare } = useCompare();

    if (compareItems.length === 0) {
        return (
            <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>Compare Products</Typography>
                <Typography variant="body1" color="text.secondary" mb={4}>You have no items to compare.</Typography>
                <Button component={RouterLink} to="/shop" variant="contained" color="primary" sx={{ borderRadius: 8, px: 4 }}>
                    Continue Shopping
                </Button>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">Compare Products</Typography>
                <Button variant="outlined" color="error" onClick={clearCompare} startIcon={<DeleteOutlined />}>
                    Clear All
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                <Table sx={{ minWidth: 650 }} aria-label="compare table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', width: '20%', bgcolor: 'grey.50' }}>Features</TableCell>
                            {compareItems.map((item) => (
                                <TableCell key={item._id || item.id} align="center" sx={{ width: `${80 / compareItems.length}%`, bgcolor: 'grey.50' }}>
                                    <Box sx={{ position: 'relative' }}>
                                        <IconButton 
                                            size="small" 
                                            color="error"
                                            onClick={() => removeFromCompare(item._id || item.id)}
                                            sx={{ position: 'absolute', top: -16, right: -16, bgcolor: 'white', boxShadow: 1 }}
                                        >
                                            <DeleteOutlined fontSize="small" />
                                        </IconButton>
                                        <Box component="img" src={item.image || '/placeholder-shoe.png'} alt={item.name} sx={{ width: 120, height: 120, objectFit: 'contain', mb: 2 }} />
                                        <Typography variant="subtitle1" fontWeight="bold" noWrap title={item.name}>
                                            {item.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>Brand</TableCell>
                            {compareItems.map((item) => (
                                <TableCell key={item._id || item.id} align="center">{item.brand || 'N/A'}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>Price</TableCell>
                            {compareItems.map((item) => (
                                <TableCell key={item._id || item.id} align="center">
                                    <Typography variant="h6" color="primary.main" fontWeight="bold">
                                        ₹{item.price}
                                    </Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>Rating</TableCell>
                            {compareItems.map((item) => (
                                <TableCell key={item._id || item.id} align="center">
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                        <Rating value={item.rating || 0} readOnly size="small" />
                                        <Typography variant="body2" color="text.secondary">({item.reviewsCount || 0})</Typography>
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>Availability</TableCell>
                            {compareItems.map((item) => (
                                <TableCell key={item._id || item.id} align="center">
                                    <Typography color={item.countInStock > 0 ? 'success.main' : 'error.main'} fontWeight={500}>
                                        {item.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>Action</TableCell>
                            {compareItems.map((item) => (
                                <TableCell key={item._id || item.id} align="center">
                                    <Button 
                                        variant="contained" 
                                        size="small" 
                                        startIcon={<ShoppingCart />}
                                        disabled={!item.countInStock}
                                        sx={{ borderRadius: 8 }}
                                    >
                                        Add to Cart
                                    </Button>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
