import React, { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import DeliveryLayout from '../layout/DeliveryLayout';
import { useNavigate } from 'react-router-dom';

import { 
    Box, Card, Typography, Avatar, Button, IconButton, 
    Divider, Chip, Skeleton, List, ListItem, ListItemAvatar, 
    ListItemText, Tabs, Tab, Stack, Paper, Alert
} from '@mui/material';
import { 
    NotificationsRounded, DoneAllRounded, DeleteOutlineRounded, 
    LocalShippingRounded, NotificationsActiveRounded, ChevronRightRounded 
} from '@mui/icons-material';

export default function DeliveryNotifications() {
    const { socket } = useSocket();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [tabValue, setTabValue] = useState("all");

    // Load initial notifications (simulated fetch time for skeleton)
    useEffect(() => {
        const loadExisting = () => {
            try {
                // In a real app, this would be an API call.
                // We parse any locally cached socket notifications here if they exist.
                const cached = JSON.parse(localStorage.getItem('delivery_notifications') || '[]');
                setNotifications(cached);
            } catch (err) {
                setError("Failed to load notifications");
            } finally {
                setLoading(false);
            }
        };
        
        // Simulate network delay for skeleton display
        setTimeout(loadExisting, 800);
    }, []);

    // Listen to real-time socket events
    useEffect(() => {
        if (!socket) return;

        const handleNewAssignment = (data) => {
            const newNotif = {
                id: Date.now().toString(),
                title: 'New Task Assigned',
                description: `Order #${data.orderId ? data.orderId.substring(data.orderId.length - 8).toUpperCase() : 'UNKNOWN'} has been assigned to you.`,
                time: new Date().toISOString(),
                read: false,
                type: 'order',
                orderId: data.orderId
            };
            
            setNotifications(prev => {
                const updated = [newNotif, ...prev];
                localStorage.setItem('delivery_notifications', JSON.stringify(updated));
                return updated;
            });
        };

        const handleStatusUpdate = (data) => {
            const newNotif = {
                id: Date.now().toString(),
                title: 'Order Updated',
                description: `Status changed for Order #${data.orderId ? data.orderId.substring(data.orderId.length - 8).toUpperCase() : 'UNKNOWN'}.`,
                time: new Date().toISOString(),
                read: false,
                type: 'delivery',
                orderId: data.orderId
            };
            
            setNotifications(prev => {
                const updated = [newNotif, ...prev];
                localStorage.setItem('delivery_notifications', JSON.stringify(updated));
                return updated;
            });
        };

        socket.on('new_order_assignment', handleNewAssignment);
        socket.on('order_status_update', handleStatusUpdate);

        return () => {
            socket.off('new_order_assignment', handleNewAssignment);
            socket.off('order_status_update', handleStatusUpdate);
        };
    }, [socket]);

    const handleMarkAsRead = (id) => {
        setNotifications(prev => {
            const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
            localStorage.setItem('delivery_notifications', JSON.stringify(updated));
            return updated;
        });
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev => {
            const updated = prev.map(n => ({ ...n, read: true }));
            localStorage.setItem('delivery_notifications', JSON.stringify(updated));
            return updated;
        });
    };

    const handleDelete = (id) => {
        setNotifications(prev => {
            const updated = prev.filter(n => n.id !== id);
            localStorage.setItem('delivery_notifications', JSON.stringify(updated));
            return updated;
        });
    };

    const handleOpenOrder = (orderId) => {
        // Navigate to my orders page, perhaps with orderId search query (if implemented)
        navigate('/delivery-orders');
    };

    const filteredNotifications = notifications.filter(n => {
        if (tabValue === "all") return true;
        return n.type === tabValue;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'order': return <LocalShippingRounded />;
            case 'delivery': return <NotificationsActiveRounded />;
            case 'system': return <NotificationsRounded />;
            default: return <NotificationsRounded />;
        }
    };

    return (
        <DeliveryLayout>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="800" gutterBottom>
                        Notifications
                        {unreadCount > 0 && (
                            <Chip 
                                label={`${unreadCount} New`} 
                                color="error" 
                                size="small" 
                                sx={{ ml: 2, verticalAlign: 'middle', fontWeight: 700 }} 
                            />
                        )}
                    </Typography>
                    <Typography color="text.secondary">
                        Stay updated with your latest assignments and alerts
                    </Typography>
                </Box>
                {unreadCount > 0 && (
                    <Button 
                        variant="outlined" 
                        startIcon={<DoneAllRounded />}
                        onClick={handleMarkAllAsRead}
                        sx={{ borderRadius: 2 }}
                    >
                        Mark all as read
                    </Button>
                )}
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1, bgcolor: 'background.paper' }}>
                    <Tabs 
                        value={tabValue} 
                        onChange={(e, v) => setTabValue(v)}
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label="All" value="all" sx={{ fontWeight: 600 }} />
                        <Tab label="Orders" value="order" sx={{ fontWeight: 600 }} />
                        <Tab label="Delivery" value="delivery" sx={{ fontWeight: 600 }} />
                        <Tab label="System" value="system" sx={{ fontWeight: 600 }} />
                    </Tabs>
                </Box>

                <List sx={{ p: 0 }}>
                    {loading ? (
                        Array.from(new Array(4)).map((_, index) => (
                            <Box key={index}>
                                <ListItem sx={{ p: 3 }}>
                                    <ListItemAvatar>
                                        <Skeleton variant="circular" width={48} height={48} />
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={<Skeleton width="40%" height={24} sx={{ mb: 1 }} />}
                                        secondary={<Skeleton width="70%" />}
                                    />
                                    <Skeleton variant="rounded" width={80} height={32} />
                                </ListItem>
                                {index < 3 && <Divider />}
                            </Box>
                        ))
                    ) : filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification, index) => (
                            <Box key={notification.id}>
                                <ListItem 
                                    sx={{ 
                                        p: 3, 
                                        bgcolor: notification.read ? 'background.paper' : 'rgba(108, 53, 255, 0.04)',
                                        transition: 'background-color 0.2s',
                                        '&:hover': { bgcolor: 'action.hover' }
                                    }}
                                    secondaryAction={
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            {notification.orderId && (
                                                <IconButton 
                                                    size="small" 
                                                    color="primary"
                                                    onClick={() => handleOpenOrder(notification.orderId)}
                                                    title="View Order"
                                                >
                                                    <ChevronRightRounded />
                                                </IconButton>
                                            )}
                                            <IconButton 
                                                size="small" 
                                                color="error"
                                                onClick={() => handleDelete(notification.id)}
                                                title="Delete"
                                            >
                                                <DeleteOutlineRounded fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    }
                                >
                                    <ListItemAvatar sx={{ mt: 0, alignSelf: 'flex-start' }}>
                                        <Avatar sx={{ 
                                            bgcolor: notification.read ? 'action.hover' : 'primary.light', 
                                            color: notification.read ? 'text.secondary' : 'primary.dark',
                                            width: 48,
                                            height: 48
                                        }}>
                                            {getIconForType(notification.type)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        sx={{ m: 0, pr: 8 }}
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                {!notification.read && (
                                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
                                                )}
                                                <Typography variant="body1" fontWeight={notification.read ? 600 : 800}>
                                                    {notification.title}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ ml: 2, fontWeight: 500 }}>
                                                    {getTimeAgo(notification.time)}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                                    {notification.description}
                                                </Typography>
                                                {!notification.read && (
                                                    <Button 
                                                        size="small" 
                                                        variant="text" 
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        sx={{ p: 0, minWidth: 'auto', fontWeight: 600 }}
                                                    >
                                                        Mark as read
                                                    </Button>
                                                )}
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {index < filteredNotifications.length - 1 && <Divider />}
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ p: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <Paper elevation={0} sx={{ p: 3, borderRadius: '50%', bgcolor: 'action.hover', mb: 2 }}>
                                <NotificationsRounded sx={{ fontSize: 64, color: 'text.disabled' }} />
                            </Paper>
                            <Typography variant="h6" fontWeight="700" color="text.primary" gutterBottom>
                                All caught up!
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                                You don't have any {tabValue !== 'all' ? tabValue : ''} notifications at the moment. We'll alert you when something comes up.
                            </Typography>
                        </Box>
                    )}
                </List>
            </Card>
        </DeliveryLayout>
    );
}
