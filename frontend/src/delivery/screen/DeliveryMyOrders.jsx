import React, { useEffect, useState } from 'react';
import { BaseUrl } from '../../axiosInstance';
import { toast } from "react-toastify";
import DeliveryLayout from '../layout/DeliveryLayout';
import { 
    Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    TextField, Button, Chip, Typography, InputAdornment, MenuItem, Avatar, 
    TablePagination, IconButton, Stack, Select, Dialog, DialogTitle, DialogContent,
    Stepper, Step, StepLabel, Divider, CircularProgress, Skeleton, Alert
} from '@mui/material';
import { 
    SearchRounded, FilterAltRounded, MapRounded, PhoneRounded, 
    CloseRounded, AssignmentRounded 
} from '@mui/icons-material';

export default function DeliveryMyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState(""); 
    const [statusFilter, setStatusFilter] = useState("all"); 
    const [filteredOrders, setFilteredOrders] = useState([]);
    
    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Modal
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await BaseUrl.get("/get-assigned-order");
            if (data.Success) {
                setOrders(data.orders || []);
                setFilteredOrders(data.orders || []);
            } else {
                setError("Failed to load orders");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError("Error connecting to server to fetch orders.");
            toast.error("Failed to load orders.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchOrders();
    }, []);

    // Filter Logic
    useEffect(() => {
        let temp = [...orders];

        if (statusFilter !== "all") {
            temp = temp.filter(o => o.orderStatus === statusFilter);
        }

        if (search) {
            const lowerQuery = search.toLowerCase();
            temp = temp.filter(o => 
                o._id.toLowerCase().includes(lowerQuery) ||
                o.userId?.fullName?.toLowerCase().includes(lowerQuery) ||
                o.userId?.phone?.includes(lowerQuery) ||
                o.address?.city?.toLowerCase().includes(lowerQuery)
            );
        }

        setFilteredOrders(temp);
        setPage(0); // Reset page on filter
    }, [search, statusFilter, orders]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCallCustomer = (phone) => {
        window.open(`tel:${phone}`, "_self");
    };

    const handleNavigate = (address) => {
        const addressStr = `${address.area}, ${address.postOffice}, ${address.city}, ${address.district}, ${address.state} - ${address.pinCode}`;
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressStr)}`;
        window.open(mapUrl, "_blank");
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "placed": return "primary";
            case "confirmed": return "info";
            case "packed": return "warning";
            case "shipped": return "secondary";
            case "out_for_delivery": return "secondary"; 
            case "reached_customer": return "secondary"; 
            case "delivered": return "success";
            case "cancelled": return "error";
            default: return "default";
        }
    };

    const getStatusText = (status) => status ? status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "";

    const steps = ['Picked Up', 'Out for Delivery', 'Arriving Soon', 'Delivered'];
    const getActiveStep = (status) => {
        switch (status) {
            case 'placed': case 'confirmed': case 'packed': return 0;
            case 'shipped': case 'out_for_delivery': return 1;
            case 'reached_customer': return 2;
            case 'delivered': return 4;
            default: return 0;
        }
    };

    return (
        <DeliveryLayout>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="800" gutterBottom>
                    My Orders
                </Typography>
                <Typography color="text.secondary">
                    Manage and track your assigned delivery orders
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            <Card sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
                {/* Top Filter Area */}
                <Box sx={{ p: { xs: 1.5, sm: 2 }, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <TextField
                        size="small"
                        placeholder="Search by ID, Customer, or City..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ flex: { xs: '1 1 100%', sm: '1 1 250px' }, minWidth: 0 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRounded fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    <Select
                        size="small"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        displayEmpty
                        sx={{ flex: { xs: '1 1 100%', sm: '0 0 160px' }, minWidth: 0 }}
                        startAdornment={
                            <InputAdornment position="start">
                                <FilterAltRounded fontSize="small" />
                            </InputAdornment>
                        }
                    >
                        <MenuItem value="all">All Statuses</MenuItem>
                        <MenuItem value="placed">Placed</MenuItem>
                        <MenuItem value="packed">Packed</MenuItem>
                        <MenuItem value="out_for_delivery">Out for Delivery</MenuItem>
                        <MenuItem value="reached_customer">Reached</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                </Box>

                {/* Order List Table */}
                <TableContainer sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <Table sx={{ minWidth: 800 }}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'background.default' }}>
                                <TableCell>Product</TableCell>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                // Skeleton Loaders
                                Array.from(new Array(5)).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell><Skeleton variant="circular" width={40} height={40} /></TableCell>
                                        <TableCell><Skeleton width="80%" /></TableCell>
                                        <TableCell><Skeleton width="60%" /><Skeleton width="40%" /></TableCell>
                                        <TableCell><Skeleton width="90%" /></TableCell>
                                        <TableCell><Skeleton width="70%" /></TableCell>
                                        <TableCell><Skeleton width="50%" /></TableCell>
                                        <TableCell><Skeleton variant="rounded" width={80} height={24} /></TableCell>
                                        <TableCell align="right"><Skeleton variant="rounded" width={60} height={32} sx={{ ml: 'auto' }} /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredOrders.length > 0 ? (
                                filteredOrders
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((order) => (
                                    <TableRow key={order._id} hover sx={{ cursor: 'pointer', transition: 'background-color 0.2s', '&:hover': { bgcolor: 'action.hover' } }} onClick={() => handleViewDetails(order)}>
                                        <TableCell>
                                            <Avatar 
                                                variant="rounded" 
                                                src={order.cartItems?.[0]?.product?.images?.[0] ? `${BaseUrl.defaults.baseURL}/${order.cartItems[0].product.images[0]}` : ''}
                                                sx={{ width: 48, height: 48, bgcolor: 'primary.light', color: 'primary.dark' }}
                                            >
                                                <AssignmentRounded />
                                            </Avatar>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                                            #{order._id.substring(order._id.length - 8).toUpperCase()}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="600">{order.userId?.fullName}</Typography>
                                            <Typography variant="caption" color="text.secondary">{order.userId?.phone}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 200 }}>
                                            <Typography variant="body2" noWrap>
                                                {order.address?.area}, {order.address?.city}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {new Date(order.createdAt).toLocaleDateString('en-GB')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>
                                            ₹{order.total}
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={getStatusText(order.orderStatus)} 
                                                color={getStatusColor(order.orderStatus)} 
                                                size="small" 
                                                variant="filled"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button 
                                                variant="outlined" 
                                                size="small" 
                                                onClick={(e) => { e.stopPropagation(); handleViewDetails(order); }}
                                                sx={{ borderRadius: 2 }}
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <AssignmentRounded sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                                            <Typography variant="h6" color="text.primary">No Orders Found</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                You have no assigned orders matching your filters.
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {!loading && filteredOrders.length > 0 && (
                    <TablePagination
                        component="div"
                        count={filteredOrders.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                        sx={{ borderTop: 1, borderColor: 'divider' }}
                    />
                )}
            </Card>

            {/* Order Details Dialog */}
            <Dialog
                open={showModal && selectedOrder !== null}
                onClose={() => setShowModal(false)}
                maxWidth="sm"
                fullWidth
            >
                {selectedOrder && (
                    <>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                            <Typography variant="h6" fontWeight="700">Order Details</Typography>
                            <IconButton onClick={() => setShowModal(false)} size="small">
                                <CloseRounded />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Chip 
                                    label={`#${selectedOrder._id.substring(selectedOrder._id.length - 8).toUpperCase()}`} 
                                    sx={{ bgcolor: 'primary.light', color: 'primary.dark', fontWeight: 700 }} 
                                />
                                <Chip 
                                    label={getStatusText(selectedOrder.orderStatus)} 
                                    color={getStatusColor(selectedOrder.orderStatus)} 
                                    size="small" 
                                />
                            </Box>

                            <Stepper activeStep={getActiveStep(selectedOrder.orderStatus)} alternativeLabel sx={{ mt: 3, mb: 4 }}>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel StepIconProps={{ sx: { color: 'primary.main' } }}>
                                            <Typography variant="caption" fontWeight="600">{label}</Typography>
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>

                            <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>Customer Information</Typography>
                                    <Typography variant="body1" fontWeight="600">{selectedOrder.userId?.fullName}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{selectedOrder.userId?.phone}</Typography>
                                    <Typography variant="body2">
                                        {selectedOrder.address?.area}, {selectedOrder.address?.postOffice}, <br/>
                                        {selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pinCode}
                                    </Typography>
                                </Box>
                            </Card>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                <Typography variant="subtitle2" fontWeight="700">Total Amount to Collect</Typography>
                                <Typography variant="h6" fontWeight="800" color="primary.main">₹{selectedOrder.total}</Typography>
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                            <Button 
                                variant="outlined" 
                                onClick={() => handleCallCustomer(selectedOrder.userId?.phone)}
                                startIcon={<PhoneRounded />}
                            >
                                Call
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={() => handleNavigate(selectedOrder.address)}
                                startIcon={<MapRounded />}
                            >
                                Navigate Map
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

        </DeliveryLayout>
    );
}
