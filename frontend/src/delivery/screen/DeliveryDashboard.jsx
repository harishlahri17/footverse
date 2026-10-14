import React, { useEffect, useState } from 'react';
import { BaseUrl } from '../../axiosInstance';
import { useAuth } from '../../store/auth';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { toast } from 'react-toastify';
import GoogleMap from '../component/GoogleMap';
import DeliveryLayout from '../layout/DeliveryLayout';

import { 
    Box, Grid, Card, CardContent, Typography, Stack, Tabs, Tab, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Avatar, Chip, Button, IconButton, Divider, Stepper, Step, StepLabel, 
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Switch
} from '@mui/material';
import { 
    CheckCircleRounded, Inventory2Rounded, LocalShippingRounded, CurrencyRupeeRounded, 
    PhoneRounded, LocationOnRounded, ChevronRightRounded, CloseRounded, VisibilityRounded, 
    MoreVertRounded, MapRounded
} from '@mui/icons-material';

export default function DeliveryDashboard() {
    const location = useLocation();
    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    const [assignedOrders, setAssignedOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filterType, setFilterType] = useState("active");
    const [loading, setLoading] = useState(true);
    const { logoutUser, user } = useAuth();

    const navigate = useNavigate();
    const { socket, updateLocation } = useSocket();

    // order fetching 
    const fetchAssignedOrders = async () => {
        setLoading(true);
        try {
            const { data } = await BaseUrl.get("/get-assigned-order");
            if (data.Success) {
                setAssignedOrders(data.orders);
                filterOrders(data.orders, filterType);
                calculateStats(data.orders);
            }
        } catch (error) {
            console.error("Error fetching assigned orders:", error);
            toast.error("Failed to load assigned orders.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignedOrders();
    }, []);

    // filter order by pending or complete
    const filterOrders = (ordersList, filter) => {
        if (filter === "active") {
            setFilteredOrders(ordersList.filter(o => o.orderStatus !== "delivered" && o.orderStatus !== "cancelled"));
        } else if (filter === "completed") {
            setFilteredOrders(ordersList.filter(o => o.orderStatus === "delivered"));
        } else if (filter === "cancelled") {
            setFilteredOrders(ordersList.filter(o => o.orderStatus === "cancelled"));
        } else {
            setFilteredOrders(ordersList.filter(o => o.orderStatus === "delivered" || o.orderStatus === "cancelled"));
        }
    };

    useEffect(() => {
        filterOrders(assignedOrders, filterType);
    }, [filterType, assignedOrders]);


    // Stats
    const [stats, setStats] = useState({
        todayDeliveries: 0,
        pendingDeliveries: 0,
        completedDeliveries: 0,
        codCollection: 0,
        todayEarnings: 0
    });
    const calculateStats = (orders) => {
        const today = new Date().toISOString().split("T")[0];
        const todayOrders = orders.filter(o =>
            new Date(o.createdAt).toISOString().split("T")[0] === today
        );

        setStats({
            todayDeliveries: todayOrders.filter(o => o.orderStatus === "delivered").length,
            pendingDeliveries: orders.filter(o => o.orderStatus !== "delivered" && o.orderStatus !== "cancelled").length,
            completedDeliveries: orders.filter(o => o.orderStatus === "delivered").length,
            codCollection: todayOrders.filter(o => o.paymentMode === "COD" && o.orderStatus === "delivered").reduce((sum, o) => sum + o.total, 0),
            todayEarnings: todayOrders.filter(o => o.orderStatus === "delivered").length * 30 // Assuming ₹30 per delivery
        });
    };

    useEffect(() => {
        calculateStats(assignedOrders);
    }, [assignedOrders]);

    // accept order 
    const handleAcceptOrder = async (orderId) => {
        try {
            const { data } = await BaseUrl.put("/accept-assigned-order", { orderId });
            if (data?.Success) {
                toast.success("Order accepted!");
                fetchAssignedOrders();
            }
        } catch (error) {
            console.error("Error accepting order:", error);
            toast.error(error.response?.data?.Message || "Failed to accept order");
        }
    };

    // start delivery of order
    const handleStartDelivery = async (orderId) => {
        try {
            const { data } = await BaseUrl.put("/start-delivery-order", { orderId });
            if (data.Success) {
                toast.success("Order delivery started!");
                fetchAssignedOrders();
            }
        } catch (error) {
            console.error("Error starting delivery:", error);
            toast.error(error.response?.data?.Message || "Failed to start delivery");
        }
    };

    // navigate into google map 
    const handleNavigate = (address) => {
        const addressStr = `${address.area}, ${address.postOffice}, ${address.city}, ${address.district}, ${address.state} - ${address.pinCode}`;
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressStr)}`;
        window.open(mapUrl, "_blank");
    };

    // reached order in delivery location 
    const handleReachedLocation = async (orderId) => {
        try {
            const { data } = await BaseUrl.put("/reached-delivery-order", { orderId });
            if (data.Success) {
                toast.success("Reached customer location!");
                fetchAssignedOrders();
            }
        } catch (error) {
            console.error("Error updating location:", error);
            toast.error(error.response?.data?.Message || "Failed to update location");
        }
    };

    // call customer 
    const handleCallCustomer = (phone) => {
        window.open(`tel:${phone}`, "_self");
    };

    // Map Modal states
    const [showMapModal, setShowMapModal] = useState(false);
    const [selectedOrderForMap, setSelectedOrderForMap] = useState(null);

    const handleViewMap = (order) => {
        setSelectedOrderForMap(order);
        setShowMapModal(true);
    };

    // OTP Modal states
    const [verifyingOrder, setVerifyingOrder] = useState(null);
    const [otpCode, setOtpCode] = useState("");
    const [showOtpModal, setShowOtpModal] = useState(false);

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otpCode || otpCode.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            const { data } = await BaseUrl.put("delivered-verify-otp", {
                orderId: verifyingOrder._id,
                otp: otpCode
            });
            if (data.Success) {
                toast.success("OTP verified! Order delivered successfully.");
                setShowOtpModal(false);
                setVerifyingOrder(null);
                setOtpCode("");
                fetchAssignedOrders();
            }
        } catch (error) {
            console.error("OTP verification error:", error);
            toast.error(error.response?.data?.Message || "Invalid OTP verification code");
        }
    };


    // Socket.io event listeners for real-time updates
    useEffect(() => {
        if (!socket) return;

        // Listen for new order assignments
        socket.on('new_order_assignment', (data) => {
            toast.info(`New order assigned: #${data.orderId}`);
            fetchAssignedOrders();
        });

        // Listen for order status updates
        socket.on('order_status_update', (data) => {
            fetchAssignedOrders();
        });

        return () => {
            socket.off('new_order_assignment');
            socket.off('order_status_update');
        };
    }, [socket]);

    const getStatusColor = (status) => {
        switch (status) {
            case "placed": return "primary";
            case "confirmed": return "info";
            case "packed": return "warning";
            case "shipped": return "secondary"; // Custom purple
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

    const currentOrder = selectedOrderForMap || assignedOrders.find(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled') || assignedOrders[0] || null;

    const renderActionButtons = (order) => {
        if (!order) return null;
        
        return (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                {order.orderStatus === "placed" && (
                    <Button variant="contained" fullWidth onClick={() => handleAcceptOrder(order._id)}>
                        Accept Task
                    </Button>
                )}

                {(order.orderStatus === "confirmed" || order.orderStatus === "packed" || order.orderStatus === "shipped") && (
                    <Button variant="contained" fullWidth color="secondary" onClick={() => handleStartDelivery(order._id)}>
                        Start Delivery
                    </Button>
                )}

                {order.orderStatus === "out_for_delivery" && (
                    <>
                        <Button variant="contained" color="primary" sx={{ flexGrow: 1 }} onClick={() => handleReachedLocation(order._id)}>
                            Reached
                        </Button>
                        <Button variant="outlined" color="primary" onClick={() => handleNavigate(order.address)}>
                            <LocationOnRounded fontSize="small" sx={{ mr: 0.5 }} /> Navigate
                        </Button>
                        <Button variant="outlined" onClick={() => handleCallCustomer(order.userId?.phone)}>
                            <PhoneRounded fontSize="small" sx={{ mr: 0.5 }} /> Call
                        </Button>
                    </>
                )}

                {order.orderStatus === "reached_customer" && (
                    <>
                        <Button variant="contained" color="success" fullWidth onClick={() => { setVerifyingOrder(order); setShowOtpModal(true); }}>
                            Mark Delivered
                        </Button>
                        <Button variant="outlined" fullWidth onClick={() => handleCallCustomer(order.userId?.phone)}>
                            <PhoneRounded fontSize="small" sx={{ mr: 0.5 }} /> Call Customer
                        </Button>
                    </>
                )}

                {(order.orderStatus === "delivered" || order.orderStatus === "cancelled") && (
                    <Button variant="contained" disabled fullWidth>
                        Job Completed
                    </Button>
                )}
            </Stack>
        );
    };

    return (
        <DeliveryLayout>
            {/* Header Greeting Section */}
            <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-start' }, gap: 2, flexWrap: 'wrap' }}>
                <Box>
                    <Typography variant={{ xs: 'h5', sm: 'h4' }} fontWeight="800" gutterBottom>
                        Hello, {user?.fullName} 👋
                    </Typography>
                    <Typography color="text.secondary">
                        Here's your delivery overview for today
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Chip 
                        icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981', ml: 1 }} />} 
                        label="Online" 
                        variant="outlined" 
                        size="small"
                        sx={{ borderColor: 'divider', bgcolor: 'background.paper', fontWeight: 600 }} 
                    />
                    <Switch defaultChecked color="success" size="small" />
                    <Button variant="outlined" size="small" sx={{ bgcolor: 'background.paper', color: 'text.primary', borderColor: 'divider', whiteSpace: 'nowrap' }}>
                        {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Button>
                </Stack>
            </Box>

            {/* KPI Cards */}
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 52, height: 52 }}>
                                <Inventory2Rounded />
                            </Avatar>
                            <Box>
                                <Typography color="text.secondary" variant="caption" fontWeight="600" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Assigned</Typography>
                                <Typography variant="h4" fontWeight="800" sx={{ lineHeight: 1.2, my: 0.25 }}>{assignedOrders.length}</Typography>
                                <Typography variant="caption" sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.25 }}>
                                    Today's orders <ChevronRightRounded sx={{ fontSize: 14 }} />
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'success.light', color: 'success.main', width: 52, height: 52 }}>
                                <CheckCircleRounded />
                            </Avatar>
                            <Box>
                                <Typography color="text.secondary" variant="caption" fontWeight="600" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Delivered</Typography>
                                <Typography variant="h4" fontWeight="800" sx={{ lineHeight: 1.2, my: 0.25 }}>{stats.completedDeliveries}</Typography>
                                <Typography variant="caption" sx={{ color: 'success.main', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.25 }}>
                                    Completed <ChevronRightRounded sx={{ fontSize: 14 }} />
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main', width: 52, height: 52 }}>
                                <LocalShippingRounded />
                            </Avatar>
                            <Box>
                                <Typography color="text.secondary" variant="caption" fontWeight="600" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Progress</Typography>
                                <Typography variant="h4" fontWeight="800" sx={{ lineHeight: 1.2, my: 0.25 }}>{stats.pendingDeliveries}</Typography>
                                <Typography variant="caption" sx={{ color: 'warning.main', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.25 }}>
                                    On the way <ChevronRightRounded sx={{ fontSize: 14 }} />
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'info.light', color: 'info.main', width: 52, height: 52 }}>
                                <CurrencyRupeeRounded />
                            </Avatar>
                            <Box>
                                <Typography color="text.secondary" variant="caption" fontWeight="600" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Today's Earnings</Typography>
                                <Typography variant="h4" fontWeight="800" sx={{ lineHeight: 1.2, my: 0.25 }}>₹{stats.todayEarnings}</Typography>
                                <Typography variant="caption" sx={{ color: 'info.main', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.25 }}>
                                    View details <ChevronRightRounded sx={{ fontSize: 14 }} />
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Middle Section: Tracking & Current Order */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={7} lg={8}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Live Tracking</Typography>
                                <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', mr: 1 }} /> Live
                                </Typography>
                            </Box>
                            <Box sx={{ flexGrow: 1, minHeight: 400, borderRadius: 2, overflow: 'hidden', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {currentOrder ? (
                                    <GoogleMap
                                        customerLocation={currentOrder.address?.latitude && currentOrder.address?.longitude ? {
                                            lat: currentOrder.address.latitude,
                                            lng: currentOrder.address.longitude
                                        } : null}
                                        orderId={currentOrder._id}
                                        height="100%"
                                    />
                                ) : (
                                    <Typography color="text.secondary">No active orders to track</Typography>
                                )}
                            </Box>
                            {currentOrder && (
                                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar sx={{ bgcolor: 'background.paper', color: 'text.primary', border: '1px solid', borderColor: 'divider' }}>
                                        <MapRounded />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight="600">ETA</Typography>
                                        <Typography variant="body2" fontWeight="700">Calculating...</Typography>
                                    </Box>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} md={5} lg={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6">Current Order Details</Typography>
                                {currentOrder && (
                                    <Chip 
                                        label={getStatusText(currentOrder.orderStatus)} 
                                        color={getStatusColor(currentOrder.orderStatus)} 
                                        size="small" 
                                    />
                                )}
                            </Box>

                            {currentOrder ? (
                                <Box>
                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography color="text.secondary" variant="body2">Order ID</Typography>
                                            <Chip size="small" label={`#${currentOrder._id.substring(currentOrder._id.length - 8).toUpperCase()}`} sx={{ bgcolor: 'primary.light', color: 'primary.dark', fontWeight: 700 }} />
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography color="text.secondary" variant="body2">Customer</Typography>
                                            <Typography variant="body2" fontWeight="600">{currentOrder.userId?.fullName}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography color="text.secondary" variant="body2">Phone</Typography>
                                            <Typography variant="body2" fontWeight="600">{currentOrder.userId?.phone}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography color="text.secondary" variant="body2">Address</Typography>
                                            <Typography variant="body2" fontWeight="600" textAlign="right" sx={{ maxWidth: '60%' }}>
                                                {currentOrder.address?.area}, {currentOrder.address?.city}
                                            </Typography>
                                        </Box>

                                        <Divider sx={{ my: 1 }} />

                                        {/* Stepper */}
                                        <Stepper activeStep={getActiveStep(currentOrder.orderStatus)} alternativeLabel sx={{ mt: 2, mb: 3 }}>
                                            {steps.map((label) => (
                                                <Step key={label}>
                                                    <StepLabel StepIconProps={{ sx: { color: 'primary.main' } }}>
                                                        <Typography variant="caption" fontWeight="600">{label}</Typography>
                                                    </StepLabel>
                                                </Step>
                                            ))}
                                        </Stepper>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                                            <Typography variant="subtitle2" fontWeight="700">Total Amount</Typography>
                                            <Typography variant="h6" fontWeight="800" color="primary.main">₹{currentOrder.total}</Typography>
                                        </Box>

                                        {renderActionButtons(currentOrder)}
                                    </Stack>
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', height: 300, alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography color="text.secondary">No current order selected</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Bottom Table: Orders List */}
            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}>
                    <Tabs 
                        value={filterType} 
                        onChange={(e, v) => setFilterType(v)}
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab 
                            label={`Active Orders (${assignedOrders.filter(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled').length})`} 
                            value="active" 
                            sx={{ fontWeight: 600 }}
                        />
                        <Tab 
                            label={`Completed (${stats.completedDeliveries})`} 
                            value="completed" 
                            sx={{ fontWeight: 600 }}
                        />
                        <Tab 
                            label={`Cancelled (${assignedOrders.filter(o => o.orderStatus === 'cancelled').length})`} 
                            value="cancelled" 
                            sx={{ fontWeight: 600 }}
                        />
                    </Tabs>
                </Box>
                
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : filteredOrders.length === 0 ? (
                    <Box sx={{ p: 5, textAlign: 'center' }}>
                        <CheckCircleRounded color="success" sx={{ fontSize: 60, opacity: 0.5, mb: 2 }} />
                        <Typography variant="h6" color="text.primary">No jobs found</Typography>
                        <Typography variant="body2" color="text.secondary">There are no {filterType} delivery tasks currently.</Typography>
                    </Box>
                ) : (
                    <TableContainer sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        <Table sx={{ minWidth: 700 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Earnings</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredOrders.map((order, index) => (
                                    <TableRow key={order._id} hover>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>{order._id.substring(order._id.length - 8).toUpperCase()}</TableCell>
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
                                            <Chip 
                                                label={getStatusText(order.orderStatus)} 
                                                color={getStatusColor(order.orderStatus)} 
                                                size="small" 
                                                variant="filled"
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>
                                            ₹{order.total}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Button 
                                                    size="small" 
                                                    variant="outlined" 
                                                    onClick={() => handleViewMap(order)}
                                                >
                                                    View
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Card>

            {/* OTP Dialog */}
            <Dialog 
                open={showOtpModal && verifyingOrder !== null} 
                onClose={() => { setShowOtpModal(false); setVerifyingOrder(null); setOtpCode(""); }}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>OTP Verification</DialogTitle>
                <form onSubmit={handleVerifyOtp}>
                    <DialogContent sx={{ textAlign: 'center' }}>
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            Ask the customer for the 6-digit OTP delivery verification code.
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="------"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                            inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '8px', fontSize: '1.5rem', fontWeight: 700 } }}
                            required
                        />
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center', p: 3, pt: 0 }}>
                        <Button onClick={() => { setShowOtpModal(false); setVerifyingOrder(null); setOtpCode(""); }} color="inherit">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="success" size="large">
                            Verify & Complete
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Map Dialog (Optional full screen map) */}
            <Dialog
                open={showMapModal && selectedOrderForMap !== null}
                onClose={() => { setShowMapModal(false); setSelectedOrderForMap(null); }}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Live Tracking Map
                    <IconButton onClick={() => { setShowMapModal(false); setSelectedOrderForMap(null); }} size="small">
                        <CloseRounded />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 0 }}>
                    {selectedOrderForMap && (
                        <GoogleMap
                            customerLocation={selectedOrderForMap.address?.latitude && selectedOrderForMap.address?.longitude ? {
                                lat: selectedOrderForMap.address.latitude,
                                lng: selectedOrderForMap.address.longitude
                            } : null}
                            orderId={selectedOrderForMap._id}
                            height="500px"
                        />
                    )}
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Delivery Address</Typography>
                        <Typography color="text.secondary">
                            {selectedOrderForMap?.userId?.fullName}<br />
                            {selectedOrderForMap?.address?.area}, {selectedOrderForMap?.address?.postOffice}<br />
                            {selectedOrderForMap?.address?.city}, {selectedOrderForMap?.address?.state} - {selectedOrderForMap?.address?.pinCode}
                        </Typography>
                    </Box>
                </DialogContent>
            </Dialog>

        </DeliveryLayout>
    );
}
