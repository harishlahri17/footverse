import React, { useEffect, useState } from 'react';
import { BaseUrl } from '../../axiosInstance';
import { useAuth } from '../../store/auth';
import { toast } from "react-toastify";
import DeliveryLayout from '../layout/DeliveryLayout';
import GoogleMap from '../component/GoogleMap';

import { 
    Box, Grid, Card, CardContent, Typography, Stack, Avatar, 
    Chip, Button, IconButton, Divider, Stepper, Step, StepLabel, 
    CircularProgress, Skeleton, Paper, List, ListItem, ListItemAvatar, 
    ListItemText, ListItemButton, Badge
} from '@mui/material';
import { 
    LocationOnRounded, PhoneRounded, NavigationRounded, 
    MapRounded, CheckCircleRounded, LocalShippingRounded, 
    AccessTimeFilledRounded, GpsFixedRounded, NearMeRounded
} from '@mui/icons-material';

export default function DeliveryLiveTracking() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await BaseUrl.get("/get-assigned-order");
            if (data.Success) {
                const assigned = data.orders || [];
                setOrders(assigned);
                
                // Prioritize 'out_for_delivery' or 'reached_customer'
                const activeOrder = assigned.find(o => 
                    o.orderStatus === 'out_for_delivery' || o.orderStatus === 'reached_customer'
                ) || assigned.find(o => 
                    o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled'
                );

                if (activeOrder && !selectedOrderId) {
                    setSelectedOrderId(activeOrder._id);
                }
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to load tracking data.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line
    }, []);

    const activeOrders = orders.filter(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled');
    const trackingOrder = orders.find(o => o._id === selectedOrderId) || activeOrders[0] || null;

    const handleCallCustomer = (phone) => {
        if (phone) window.open(`tel:${phone}`, "_self");
    };

    const handleNavigate = (address) => {
        if (!address) return;
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

    const steps = ['Assigned', 'Picked Up', 'Out for Delivery', 'Arriving Soon', 'Delivered'];
    const getActiveStep = (status) => {
        switch (status) {
            case 'placed': case 'confirmed': return 0;
            case 'packed': case 'shipped': return 1;
            case 'out_for_delivery': return 2;
            case 'reached_customer': return 3;
            case 'delivered': return 4;
            default: return 0;
        }
    };

    return (
        <DeliveryLayout>
            {/* Page Header & Status Card */}
            <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="800" gutterBottom>
                        Live Tracking
                    </Typography>
                    <Typography color="text.secondary">
                        Track your current delivery and route
                    </Typography>
                </Box>
                
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', minWidth: { xs: '100%', md: 350 } }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Stack direction="row" spacing={3} alignItems="center" justifyContent="space-between">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Badge color="success" variant="dot" overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                                    <Avatar sx={{ bgcolor: 'success.light', color: 'success.dark', width: 40, height: 40 }}>
                                        <NearMeRounded fontSize="small" />
                                    </Avatar>
                                </Badge>
                                <Box>
                                    <Typography variant="body2" color="text.secondary" fontWeight={600}>GPS Status</Typography>
                                    <Typography variant="body1" fontWeight={700} color="success.main">Active & Syncing</Typography>
                                </Box>
                            </Box>
                            <Divider orientation="vertical" flexItem />
                            <Box>
                                <Typography variant="body2" color="text.secondary" fontWeight={600}>Last Updated</Typography>
                                <Typography variant="body1" fontWeight={700}>Just now</Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>

            {loading ? (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Skeleton variant="rounded" height={600} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Skeleton variant="rounded" height={600} />
                    </Grid>
                </Grid>
            ) : !trackingOrder ? (
                <Card sx={{ p: 8, textAlign: 'center', borderRadius: 4 }}>
                    <MapRounded sx={{ fontSize: 80, color: 'text.disabled', opacity: 0.5, mb: 2 }} />
                    <Typography variant="h5" fontWeight="700" gutterBottom>No Active Deliveries</Typography>
                    <Typography color="text.secondary">You don't have any active deliveries to track right now.</Typography>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {/* LEFT: Map Area */}
                    <Grid item xs={12} md={8}>
                        <Card sx={{ height: '100%', borderRadius: 4, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', minHeight: { xs: 400, md: 600 } }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <GoogleMap
                                    customerLocation={trackingOrder.address?.latitude && trackingOrder.address?.longitude ? {
                                        lat: trackingOrder.address.latitude,
                                        lng: trackingOrder.address.longitude
                                    } : null}
                                    orderId={trackingOrder._id}
                                    height="100%"
                                />
                            </Box>
                            
                            {/* Floating Map Overlays */}
                            <Box sx={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}>
                                <Paper sx={{ p: 1.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 1.5, pointerEvents: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                                    <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                                        <LocalShippingRounded fontSize="small" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">Current Task</Typography>
                                        <Typography variant="body2" fontWeight={700}>#{trackingOrder._id.substring(trackingOrder._id.length - 8).toUpperCase()}</Typography>
                                    </Box>
                                </Paper>
                                
                                <Paper sx={{ p: 1.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 1.5, pointerEvents: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                                    <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.dark', width: 32, height: 32 }}>
                                        <AccessTimeFilledRounded fontSize="small" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">ETA</Typography>
                                        <Typography variant="body2" fontWeight={700}>Calculating...</Typography>
                                    </Box>
                                </Paper>
                            </Box>
                        </Card>
                    </Grid>

                    {/* RIGHT: Order Details Panel */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', borderRadius: 4, display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ p: 3, flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" fontWeight="800">Delivery Details</Typography>
                                    <Chip 
                                        label={getStatusText(trackingOrder.orderStatus)} 
                                        color={getStatusColor(trackingOrder.orderStatus)} 
                                        size="small"
                                        sx={{ fontWeight: 600 }}
                                    />
                                </Box>

                                {/* Customer Info */}
                                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, mb: 4, bgcolor: 'background.default', borderColor: 'divider' }}>
                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar src={user?.avatar || ""} sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
                                                {trackingOrder.userId?.fullName?.charAt(0) || 'C'}
                                            </Avatar>
                                            <Box flexGrow={1}>
                                                <Typography variant="body1" fontWeight="700">{trackingOrder.userId?.fullName}</Typography>
                                                <Typography variant="body2" color="text.secondary">{trackingOrder.userId?.phone}</Typography>
                                            </Box>
                                            <IconButton color="primary" onClick={() => handleCallCustomer(trackingOrder.userId?.phone)} sx={{ bgcolor: 'primary.50' }}>
                                                <PhoneRounded />
                                            </IconButton>
                                        </Box>
                                        
                                        <Divider />
                                        
                                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                                            <LocationOnRounded color="error" sx={{ mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" fontWeight="600">Delivery Address</Typography>
                                                <Typography variant="body2" fontWeight="500">
                                                    {trackingOrder.address?.area}, {trackingOrder.address?.city} <br/>
                                                    {trackingOrder.address?.state} - {trackingOrder.address?.pinCode}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Paper>

                                {/* Timeline Stepper */}
                                <Typography variant="subtitle1" fontWeight="700" gutterBottom>
                                    Tracking Timeline
                                </Typography>
                                <Box sx={{ mb: 4, px: 1 }}>
                                    <Stepper activeStep={getActiveStep(trackingOrder.orderStatus)} orientation="vertical">
                                        {steps.map((label, index) => (
                                            <Step key={label}>
                                                <StepLabel 
                                                    StepIconProps={{ sx: { color: getActiveStep(trackingOrder.orderStatus) >= index ? 'secondary.main' : 'text.disabled' } }}
                                                >
                                                    <Typography 
                                                        variant="body2" 
                                                        fontWeight={getActiveStep(trackingOrder.orderStatus) === index ? "800" : "500"}
                                                        color={getActiveStep(trackingOrder.orderStatus) === index ? "text.primary" : "text.secondary"}
                                                    >
                                                        {label}
                                                    </Typography>
                                                </StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </Box>

                                {/* Product Summary */}
                                {trackingOrder.cartItems?.length > 0 && (
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Items in order</Typography>
                                        <Typography variant="body2" fontWeight="600">
                                            {trackingOrder.cartItems.length} Item(s) • ₹{trackingOrder.total}
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                            
                            {/* Action Buttons */}
                            <Box sx={{ p: 3, pt: 0 }}>
                                <Button 
                                    variant="contained" 
                                    color="secondary" 
                                    fullWidth 
                                    size="large"
                                    startIcon={<NavigationRounded />}
                                    onClick={() => handleNavigate(trackingOrder.address)}
                                    sx={{ borderRadius: 2, py: 1.5, fontWeight: 700 }}
                                >
                                    Navigate to Destination
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Bottom Section: Other Active Deliveries */}
            {!loading && activeOrders.length > 1 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" fontWeight="700" gutterBottom>
                        Other Active Deliveries ({activeOrders.length - 1})
                    </Typography>
                    <Grid container spacing={2}>
                        {activeOrders.filter(o => o._id !== trackingOrder?._id).map(order => (
                            <Grid item xs={12} sm={6} md={4} key={order._id}>
                                <Card 
                                    variant="outlined" 
                                    sx={{ 
                                        borderRadius: 3, 
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': { borderColor: 'secondary.main', boxShadow: '0 4px 12px rgba(108, 53, 255, 0.1)' }
                                    }}
                                    onClick={() => setSelectedOrderId(order._id)}
                                >
                                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" fontWeight="700" color="primary.main">
                                                #{order._id.substring(order._id.length - 8).toUpperCase()}
                                            </Typography>
                                            <Chip label={getStatusText(order.orderStatus)} color={getStatusColor(order.orderStatus)} size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                                        </Box>
                                        <Typography variant="body2" noWrap sx={{ mb: 0.5 }}>
                                            <LocationOnRounded sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5, verticalAlign: 'text-bottom' }} />
                                            {order.address?.city}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            {order.userId?.fullName}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </DeliveryLayout>
    );
}
