import React, { useEffect, useState, useRef } from 'react';
import { toast } from "react-toastify";
import { BaseUrl } from '../../axiosInstance';
import { useAuth } from '../../store/auth';
import { 
    Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    TextField, Button, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, InputAdornment, Menu, MenuItem, Divider, Card, CardContent, List, ListItem, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import MemoryIcon from '@mui/icons-material/Memory';

import PageHeader from '../component/mui/PageHeader';
import SectionCard from '../component/mui/SectionCard';

export default function Orders() {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all"); 
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [search, setSearch] = useState(""); 

    // Modal states
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);

    // Delivery Partners
    const [deliveryPartners, setDeliveryPartners] = useState([]);
    const [assigningOrder, setAssigningOrder] = useState(null);
    
    // Status Menu State
    const [anchorElMap, setAnchorElMap] = useState({});

    const handleMenuClick = (event, orderId) => {
        setAnchorElMap({ ...anchorElMap, [orderId]: event.currentTarget });
    };

    const handleMenuClose = (orderId) => {
        setAnchorElMap({ ...anchorElMap, [orderId]: null });
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await BaseUrl.get("/get-all-order", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.Success) {
                setOrders(data.orders);
                calculateStatus(data.orders);
            }
        } catch (error) {
            toast.error("Failed to load orders.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    const handleUpdateStatus = async (orderId, newStatus) => {
        handleMenuClose(orderId);
        try {
            const { data } = await BaseUrl.put("/order-status", { orderId, status: newStatus });
            if (data.Success) {
                toast.success(`Order status updated to ${newStatus}`);
                fetchOrders();
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(error.response?.data?.Message || "Failed to update status");
        }
    };

    const fetchDeliveryPartners = async () => {
        try {
            const { data } = await BaseUrl.get("/fetch-deliveryMan-inOrder");
            if (data.Success) {
                setDeliveryPartners(data.partners);
            }
        } catch (error) {
            console.error("Error fetching delivery partners:", error);
        }
    };

    useEffect(() => {
        fetchDeliveryPartners();
    }, []);

    const handleAssignPartner = async (deliveryManProfileId) => {
        if (!assigningOrder) return;
        try {
            const { data } = await BaseUrl.put("/order-assign/manually", {
                orderId: assigningOrder._id,
                deliveryManProfileId             
            });
            if (data.Success) {
                toast.success("Delivery partner assigned successfully!");
                setShowAssignModal(false);
                setAssigningOrder(null);
                fetchOrders();
            }
        } catch (error) {
            console.error("Error assigning partner:", error);
            toast.error(error.response?.data?.Message || "Failed to assign partner");
        }
    };

    const getStatusChip = (status) => {
        switch (status) {
            case "placed": return <Chip label="Placed" color="primary" variant="outlined" size="small" />;
            case "confirmed": return <Chip label="Confirmed" color="info" variant="outlined" size="small" />;
            case "packed": return <Chip label="Packed" color="warning" variant="outlined" size="small" />;
            case "shipped": return <Chip label="Shipped" color="secondary" variant="outlined" size="small" />;
            case "out_for_delivery": return <Chip label="Out for Delivery" sx={{ bgcolor: 'grey.800', color: 'white' }} size="small" />;
            case "delivered": return <Chip label="Delivered" color="success" size="small" />;
            case "cancelled": return <Chip label="Cancelled" color="error" size="small" />;
            default: return <Chip label="Unknown" size="small" />;
        }
    };

    const handlePrintInvoice = () => {
        window.print();
    };

    const filterAndSearch = (allOrders, status, query) => {
        let temp = [...allOrders];

        if (status === "pending") {
            temp = temp.filter(o => o.orderStatus === "placed" || o.orderStatus === "confirmed");
        } else if (status !== "all") {
            temp = temp.filter(o => o.orderStatus === status);
        }

        if (query.trim() !== "") {
            const lowerQuery = query.toLowerCase();
            temp = temp.filter(o =>
                (o._id).toLowerCase().includes(lowerQuery) ||
                (o.fullName || "").toLowerCase().includes(lowerQuery)
            );
        }

        setFilteredOrders(temp);
    };

    useEffect(() => {
        filterAndSearch(orders, statusFilter, search);
    }, [orders, statusFilter, search]);

    const [statusCounts, setStatusCounts] = useState({
        total: 0,
        pending: 0,
        packed: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
    });
    
    const calculateStatus = (allOrders) => {
        const counts = {
            total: allOrders.length,
            pending: 0,
            packed: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
        };
        allOrders.forEach(o => {
            if (o.orderStatus === "placed" || o.orderStatus === "confirmed") counts.pending++;
            else if (o.orderStatus === "packed") counts.packed++;
            else if (o.orderStatus === "shipped") counts.shipped++;
            else if (o.orderStatus === "delivered") counts.delivered++;
            else if (o.orderStatus === "cancelled") counts.cancelled++;
        });
        setStatusCounts(counts);
    };

    const FilterCard = ({ title, count, filterKey, icon, color }) => {
        const isActive = statusFilter === filterKey;
        return (
            <Card 
                onClick={() => setStatusFilter(filterKey)}
                sx={{ 
                    cursor: 'pointer', 
                    border: isActive ? 2 : 1, 
                    borderColor: isActive ? `${color}.main` : 'divider',
                    bgcolor: isActive ? `${color}.50` : 'background.paper',
                    boxShadow: isActive ? 3 : 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                        borderColor: `${color}.main`,
                        boxShadow: 3
                    }
                }}
            >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography color="textSecondary" variant="subtitle2" fontWeight="600">{title}</Typography>
                            <Typography variant="h5" color={`${color}.main`} fontWeight="bold">{count}</Typography>
                        </Box>
                        <Box sx={{ color: `${color}.main`, opacity: 0.8 }}>
                            {icon}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box>
            <PageHeader 
                title="Order Management" 
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Orders' }
                ]} 
            />

            {/* Status Analytics Row */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6} md={4} lg={2}>
                    <FilterCard title="Total Orders" count={statusCounts.total} filterKey="all" color="primary" icon={<PendingActionsIcon fontSize="large" />} />
                </Grid>
                <Grid item xs={6} md={4} lg={2}>
                    <FilterCard title="Pending" count={statusCounts.pending} filterKey="pending" color="info" icon={<PrecisionManufacturingOutlinedIcon fontSize="large" />} />
                </Grid>
                <Grid item xs={6} md={4} lg={2}>
                    <FilterCard title="Packed" count={statusCounts.packed} filterKey="packed" color="warning" icon={<LocalShippingIcon fontSize="large" />} />
                </Grid>
                <Grid item xs={6} md={4} lg={2}>
                    <FilterCard title="Shipped" count={statusCounts.shipped} filterKey="shipped" color="secondary" icon={<LocalShippingIcon fontSize="large" />} />
                </Grid>
                <Grid item xs={6} md={4} lg={2}>
                    <FilterCard title="Delivered" count={statusCounts.delivered} filterKey="delivered" color="success" icon={<CheckCircleOutlineIcon fontSize="large" />} />
                </Grid>
                <Grid item xs={6} md={4} lg={2}>
                    <FilterCard title="Cancelled" count={statusCounts.cancelled} filterKey="cancelled" color="error" icon={<CancelOutlinedIcon fontSize="large" />} />
                </Grid>
            </Grid>

            {/* Main Orders Table */}
            <SectionCard>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <TextField
                        placeholder="Search by ID, Name..."
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: { xs: '100%', sm: '300px' } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<RefreshIcon />}
                        onClick={fetchOrders}
                    >
                        Refresh
                    </Button>
                </Box>

                <TableContainer>
                    <Table hover size="medium">
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Payment Mode</TableCell>
                                <TableCell>Payment Status</TableCell>
                                <TableCell>Order Status</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Delivery Partner</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center" sx={{ py: 3 }}>Loading...</TableCell>
                                </TableRow>
                            ) : filteredOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center" sx={{ py: 3 }}>No Orders Found</TableCell>
                                </TableRow>
                            ) : (
                                filteredOrders.map((order) => (
                                    <TableRow key={order._id} hover>
                                        <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                                            {order._id.substring(order._id.length - 8).toUpperCase()}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="600">{order.fullName}</Typography>
                                            <Typography variant="caption" color="textSecondary" display="block">{order.phone}</Typography>
                                            <Typography variant="caption" color="textSecondary" display="block">{order.email}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={order.paymentMode} size="small" variant="outlined" />
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={order.paymentStatus} 
                                                size="small"
                                                color={order.paymentStatus === 'Paid' ? 'success' : order.paymentStatus === 'Failed' ? 'error' : 'warning'}
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </TableCell>
                                        <TableCell>{getStatusChip(order.orderStatus)}</TableCell>
                                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>₹{order.total}</TableCell>
                                        <TableCell>
                                            {order.deliveryPartnerId ? (
                                                <Typography variant="body2" color="success.main" fontWeight="600">
                                                    {order.deliveryPartnerId.fullName}
                                                </Typography>
                                            ) : (
                                                <Chip label="Unassigned" color="warning" size="small" variant="outlined" />
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                <IconButton size="small" color="primary" onClick={() => { setSelectedOrder(order); setShowDetailModal(true); }}>
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>

                                                {order.orderStatus !== "delivered" && order.orderStatus !== "cancelled" && (
                                                    <IconButton size="small" color="info" onClick={() => { setAssigningOrder(order); setShowAssignModal(true); }}>
                                                        <PersonAddIcon fontSize="small" />
                                                    </IconButton>
                                                )}

                                                {order.orderStatus !== "delivered" && order.orderStatus !== "cancelled" && (
                                                    <>
                                                        <IconButton size="small" color="warning" onClick={(e) => handleMenuClick(e, order._id)}>
                                                            <SettingsIcon fontSize="small" />
                                                        </IconButton>
                                                        <Menu
                                                            anchorEl={anchorElMap[order._id]}
                                                            open={Boolean(anchorElMap[order._id])}
                                                            onClose={() => handleMenuClose(order._id)}
                                                        >
                                                            <MenuItem disabled><Typography variant="caption" fontWeight="bold">Update Status</Typography></MenuItem>
                                                            <MenuItem onClick={() => handleUpdateStatus(order._id, "placed")}>Placed</MenuItem>
                                                            <MenuItem onClick={() => handleUpdateStatus(order._id, "confirmed")}>Confirmed</MenuItem>
                                                            <MenuItem onClick={() => handleUpdateStatus(order._id, "packed")}>Packed</MenuItem>
                                                            <MenuItem onClick={() => handleUpdateStatus(order._id, "shipped")}>Shipped</MenuItem>
                                                            <MenuItem onClick={() => handleUpdateStatus(order._id, "out_for_delivery")}>Out for Delivery</MenuItem>
                                                            <MenuItem onClick={() => handleUpdateStatus(order._id, "delivered")}>Delivered</MenuItem>
                                                            <Divider />
                                                            <MenuItem onClick={() => handleUpdateStatus(order._id, "cancelled")} sx={{ color: 'error.main' }}>Cancel Order</MenuItem>
                                                        </Menu>
                                                    </>
                                                )}

                                                <IconButton size="small" color="secondary" onClick={() => { setSelectedOrder(order); setShowInvoiceModal(true); }}>
                                                    <PictureAsPdfIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </SectionCard>

            {/* Detail Modal */}
            <Dialog open={showDetailModal && !!selectedOrder} onClose={() => setShowDetailModal(false)} maxWidth="md" fullWidth>
                {selectedOrder && (
                    <>
                        <DialogTitle sx={{ fontWeight: 'bold' }}>Order Details</DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="caption" color="textSecondary" fontWeight="bold" textTransform="uppercase">Order ID</Typography>
                                    <Typography variant="body1" fontFamily="monospace" fontWeight="bold" color="primary.main">
                                        {selectedOrder._id.toUpperCase()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
                                    <Typography variant="caption" color="textSecondary" fontWeight="bold" textTransform="uppercase">Date Placed</Typography>
                                    <Typography variant="body1" fontWeight="600">{new Date(selectedOrder.createdAt).toLocaleString()}</Typography>
                                </Grid>
                            </Grid>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={3} sx={{ mb: 3 }}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Delivery Address</Typography>
                                    <Typography variant="body2" fontWeight="600">{selectedOrder.fullName}, {selectedOrder.email}</Typography>
                                    <Typography variant="body2" fontWeight="600">Phone: {selectedOrder.phone}</Typography>
                                    <Typography variant="body2" color="textSecondary">{selectedOrder.address?.area}, {selectedOrder.address?.postOffice}</Typography>
                                    <Typography variant="body2" color="textSecondary">{selectedOrder.address?.city}, {selectedOrder.address?.district}</Typography>
                                    <Typography variant="body2" color="textSecondary">{selectedOrder.address?.state} - {selectedOrder.address?.pinCode}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Payment Details</Typography>
                                    <Typography variant="body2">Mode: <Chip label={selectedOrder.paymentMode} size="small" variant="outlined" sx={{ ml: 1 }}/></Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>Status: 
                                        <Chip 
                                            label={selectedOrder.paymentStatus} 
                                            size="small" 
                                            color={selectedOrder.paymentStatus === 'Paid' ? 'success' : selectedOrder.paymentStatus === 'Failed' ? 'error' : 'warning'} 
                                            sx={{ ml: 1, fontWeight: 600 }}
                                        />
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>OTP: <Box component="span" fontFamily="monospace" fontWeight="bold" color="primary.main">{selectedOrder.otp || "N/A"}</Box> {selectedOrder.otpVerified && <Typography component="span" color="success.main" variant="caption" fontWeight="bold">(Verified)</Typography>}</Typography>
                                </Grid>
                            </Grid>

                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Items Summary</Typography>
                            <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 3 }}>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: 'background.default' }}>
                                        <TableRow>
                                            <TableCell>Item</TableCell>
                                            <TableCell align="center">Color</TableCell>
                                            <TableCell align="center">Size</TableCell>
                                            <TableCell align="center">Qty</TableCell>
                                            <TableCell align="right">Price</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedOrder.items.map((item, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell fontWeight="600">{item.productId?.productName || "Product (Deleted)"}</TableCell>
                                                <TableCell align="center">{item.productId?.color}</TableCell>
                                                <TableCell align="center">{item.size}</TableCell>
                                                <TableCell align="center">{item.qty}</TableCell>
                                                <TableCell align="right">₹{item.price}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box display="flex" justifyContent={{ xs: 'center', sm: 'flex-end' }} mb={3}>
                                <Box width={{ xs: '100%', sm: '300px' }}>
                                    <Box display="flex" justifyContent="space-between" mb={1}><Typography color="textSecondary">Subtotal:</Typography><Typography fontWeight="600">₹{selectedOrder.subtotal}</Typography></Box>
                                    <Box display="flex" justifyContent="space-between" mb={1}><Typography color="textSecondary">Shipping:</Typography><Typography fontWeight="600">₹{selectedOrder.shipping}</Typography></Box>
                                    <Box display="flex" justifyContent="space-between" mb={1}><Typography color="textSecondary">Discount:</Typography><Typography color="error.main" fontWeight="600">-₹{selectedOrder.discount}</Typography></Box>
                                    <Divider sx={{ my: 1 }} />
                                    <Box display="flex" justifyContent="space-between"><Typography fontWeight="bold">Total:</Typography><Typography fontWeight="bold" color="primary.main" variant="h6">₹{selectedOrder.total}</Typography></Box>
                                </Box>
                            </Box>

                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Order Tracking Timeline</Typography>
                            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                {selectedOrder.trackingHistory && selectedOrder.trackingHistory.length > 0 ? (
                                    <Box sx={{ borderLeft: '2px solid', borderColor: 'divider', pl: 3, position: 'relative' }}>
                                        {selectedOrder.trackingHistory.map((track, trackIdx) => (
                                            <Box key={trackIdx} sx={{ mb: 2, position: 'relative' }}>
                                                <Box sx={{ 
                                                    position: 'absolute', left: '-31px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', 
                                                    bgcolor: trackIdx === selectedOrder.trackingHistory.length - 1 ? 'primary.main' : 'text.secondary',
                                                    boxShadow: trackIdx === selectedOrder.trackingHistory.length - 1 ? '0 0 0 4px rgba(25, 118, 210, 0.25)' : 'none'
                                                }} />
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography fontWeight="bold" textTransform="capitalize">{track.status.replace(/_/g, " ")}</Typography>
                                                    <Typography variant="caption" color="textSecondary">{new Date(track.updatedAt).toLocaleString()}</Typography>
                                                </Box>
                                                <Typography variant="body2" color="textSecondary">Location: {track.location}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="textSecondary">No tracking history recorded.</Typography>
                                )}
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setShowDetailModal(false)}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Invoice Modal */}
            <Dialog open={showInvoiceModal && !!selectedOrder} onClose={() => setShowInvoiceModal(false)} maxWidth="md" fullWidth>
                {selectedOrder && (
                    <>
                        <DialogTitle className="no-print" sx={{ fontWeight: 'bold' }}>Invoice Summary</DialogTitle>
                        <DialogContent dividers sx={{ bgcolor: 'white', color: 'black' }} id="invoice-print-area">
                            <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'flex-start' }} gap={2} mb={4}>
                                <Box>
                                    <Typography variant="h5" fontWeight="bold" color="primary.main">RETAIL INVOICE</Typography>
                                    <Typography variant="body2" fontFamily="monospace" color="text.secondary">INV-{selectedOrder._id.toUpperCase()}</Typography>
                                    <Typography variant="body2" color="text.secondary">Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</Typography>
                                </Box>
                                <Box textAlign={{ xs: 'left', sm: 'right' }}>
                                    <Typography variant="h6" fontWeight="bold">FOOTVERSE</Typography>
                                    <Typography variant="body2" color="text.secondary">Raipur Warehouse, Chhattisgarh</Typography>
                                    <Typography variant="body2" color="text.secondary">support@footverse.com</Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ my: 3 }} />
                            <Grid container spacing={3} mb={4}>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="textSecondary" fontWeight="bold" textTransform="uppercase">Billed To</Typography>
                                    <Typography variant="body2" fontWeight="bold">{selectedOrder.fullName}</Typography>
                                    <Typography variant="body2" fontWeight="bold">{selectedOrder.email}</Typography>
                                    <Typography variant="body2" fontWeight="bold">Phone: {selectedOrder.phone}</Typography>
                                    <Typography variant="body2" color="textSecondary">{selectedOrder.address?.area}, {selectedOrder.address?.postOffice}</Typography>
                                    <Typography variant="body2" color="textSecondary">{selectedOrder.address?.city}, {selectedOrder.address?.district}</Typography>
                                    <Typography variant="body2" color="textSecondary">{selectedOrder.address?.state} - {selectedOrder.address?.pinCode}</Typography>
                                </Grid>
                                <Grid item xs={6} textAlign="right">
                                    <Typography variant="caption" color="textSecondary" fontWeight="bold" textTransform="uppercase">Payment Mode</Typography>
                                    <Typography variant="body2" fontWeight="bold" mb={1}>{selectedOrder.paymentMode}</Typography>
                                    <Typography variant="caption" color="textSecondary" fontWeight="bold" textTransform="uppercase" display="block">Payment Status</Typography>
                                    <Chip 
                                        label={selectedOrder.paymentStatus} 
                                        size="small" 
                                        color={selectedOrder.paymentStatus === 'Paid' ? 'success' : 'warning'} 
                                        sx={{ fontWeight: 600 }}
                                    />
                                </Grid>
                            </Grid>

                            <TableContainer sx={{ border: '1px solid', borderColor: 'divider', mb: 4 }}>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: 'grey.100' }}>
                                        <TableRow>
                                            <TableCell>#</TableCell>
                                            <TableCell>Product Description</TableCell>
                                            <TableCell align="center">Size</TableCell>
                                            <TableCell align="center">Qty</TableCell>
                                            <TableCell align="right">Unit Price</TableCell>
                                            <TableCell align="right">Total Price</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedOrder.items.map((item, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{idx + 1}</TableCell>
                                                <TableCell fontWeight="bold">{item.productId?.productName || "Product (Deleted)"}</TableCell>
                                                <TableCell align="center">{item.size}</TableCell>
                                                <TableCell align="center">{item.qty}</TableCell>
                                                <TableCell align="right">₹{item.price}</TableCell>
                                                <TableCell align="right">₹{item.price * item.qty}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box display="flex" justifyContent={{ xs: 'center', sm: 'flex-end' }} mb={4}>
                                <Box width={{ xs: '100%', sm: '300px' }}>
                                    <Box display="flex" justifyContent="space-between" mb={1}><Typography color="textSecondary">Subtotal:</Typography><Typography>₹{selectedOrder.subtotal}</Typography></Box>
                                    <Box display="flex" justifyContent="space-between" mb={1}><Typography color="textSecondary">Shipping Charges:</Typography><Typography>₹{selectedOrder.shipping}</Typography></Box>
                                    <Box display="flex" justifyContent="space-between" mb={1}><Typography color="textSecondary">Discount Applied:</Typography><Typography color="error.main">-₹{selectedOrder.discount}</Typography></Box>
                                    <Divider sx={{ my: 1 }} />
                                    <Box display="flex" justifyContent="space-between"><Typography fontWeight="bold">Grand Total:</Typography><Typography fontWeight="bold" color="primary.main" variant="h6">₹{selectedOrder.total}</Typography></Box>
                                </Box>
                            </Box>

                            <Box textAlign="center" mt={5}>
                                <Typography variant="caption" color="textSecondary" display="block">Thank you for shopping with SHOUVERSE !</Typography>
                                <Typography variant="caption" color="textSecondary" display="block">This is a computer-generated invoice and requires no physical signature.</Typography>
                            </Box>
                        </DialogContent>
                        <DialogActions className="no-print">
                            <Button onClick={() => setShowInvoiceModal(false)}>Close</Button>
                            <Button variant="contained" color="primary" startIcon={<PrintIcon />} onClick={handlePrintInvoice}>Print Invoice</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Assign Delivery Partner Modal */}
            <Dialog open={showAssignModal} onClose={() => setShowAssignModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Assign Delivery Partner</DialogTitle>
                <DialogContent dividers>
                    <Box textAlign="center" mb={4}>
                        <Button variant="contained" color="success" size="large" fullWidth startIcon={<MemoryIcon />} sx={{ borderRadius: 8 }}>
                            Smart Auto-Assign Nearest Agent
                        </Button>
                        <Typography variant="caption" color="textSecondary" display="block" mt={1}>
                            Assigns the nearest online delivery boy with the least pending jobs.
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }}>
                        <Typography variant="caption" fontWeight="bold" color="textSecondary">OR SELECT AGENT MANUALLY</Typography>
                    </Divider>

                    {deliveryPartners.length === 0 ? (
                        <Typography color="error" textAlign="center">No active delivery partners found. Register delivery boy profiles first!</Typography>
                    ) : (
                        <List sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                            {deliveryPartners.map((partner, index) => (
                                <React.Fragment key={partner._id}>
                                    <ListItem button onClick={() => handleAssignPartner(partner._id)}>
                                        <ListItemText 
                                            primary={<Typography fontWeight="bold">{partner.userId?.fullName || "Agent Profile"}</Typography>}
                                            secondary={`Pincodes: ${partner.assignedPincodes?.join(", ")} | Jobs: ${partner.pendingOrdersCount || 0}`}
                                        />
                                        <ListItemSecondaryAction>
                                            <Chip label="Assign" color="primary" size="small" onClick={() => handleAssignPartner(partner._id)} sx={{ cursor: 'pointer' }} />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    {index < deliveryPartners.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowAssignModal(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}
