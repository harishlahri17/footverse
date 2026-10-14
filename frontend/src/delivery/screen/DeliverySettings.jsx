import React, { useState } from 'react';
import { useAuth } from '../../store/auth';
import DeliveryLayout from '../layout/DeliveryLayout';
import { useDeliveryThemeContext } from '../../theme/DeliveryThemeContextProvider';

import { 
    Box, Card, CardContent, Typography, Grid, Divider, 
    Switch, List, ListItem, ListItemText, ListItemSecondaryAction, 
    Button, Paper, Alert, Avatar
} from '@mui/material';
import { 
    SettingsRounded, NotificationsActiveRounded, 
    SecurityRounded, MapRounded, PersonRounded,
    ExitToAppRounded, DarkModeRounded
} from '@mui/icons-material';

export default function DeliverySettings() {
    const { logoutUser } = useAuth();
    const { mode, toggleColorMode } = useDeliveryThemeContext();

    // Mock states for UI purposes, using standard localStorage if needed to persist mock UI
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('delivery_settings');
        return saved ? JSON.parse(saved) : {
            pushNotifications: true,
            emailAlerts: false,
            smsAlerts: true,
            locationTracking: true,
            autoAcceptOrders: false,
            darkMode: false
        };
    });

    const [savedAlert, setSavedAlert] = useState(false);

    const handleToggle = (setting) => {
        setSettings(prev => {
            const updated = { ...prev, [setting]: !prev[setting] };
            localStorage.setItem('delivery_settings', JSON.stringify(updated));
            setSavedAlert(true);
            setTimeout(() => setSavedAlert(false), 3000);
            return updated;
        });
    };

    const handleLogout = () => {
        logoutUser();
    };

    const SettingSection = ({ title, icon, children }) => (
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2, display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: 'background.default' }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                    {icon}
                </Avatar>
                <Typography variant="h6" fontWeight="700">{title}</Typography>
            </Box>
            <CardContent sx={{ p: 0 }}>
                {children}
            </CardContent>
        </Card>
    );

    return (
        <DeliveryLayout>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="800" gutterBottom>
                        Settings
                    </Typography>
                    <Typography color="text.secondary">
                        Manage your preferences and app configurations
                    </Typography>
                </Box>
            </Box>

            {savedAlert && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                    Settings updated successfully.
                </Alert>
            )}

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    
                    <SettingSection title="Notifications" icon={<NotificationsActiveRounded fontSize="small" />}>
                        <List disablePadding>
                            <ListItem sx={{ py: 2 }}>
                                <ListItemText 
                                    primary={<Typography fontWeight="600">Push Notifications</Typography>}
                                    secondary="Receive instant alerts for new orders and status updates on your device."
                                />
                                <ListItemSecondaryAction>
                                    <Switch 
                                        edge="end" 
                                        color="primary"
                                        checked={settings.pushNotifications} 
                                        onChange={() => handleToggle('pushNotifications')} 
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                            <ListItem sx={{ py: 2 }}>
                                <ListItemText 
                                    primary={<Typography fontWeight="600">SMS Alerts</Typography>}
                                    secondary="Get text messages for critical alerts when the app is closed."
                                />
                                <ListItemSecondaryAction>
                                    <Switch 
                                        edge="end" 
                                        color="primary"
                                        checked={settings.smsAlerts} 
                                        onChange={() => handleToggle('smsAlerts')} 
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                            <ListItem sx={{ py: 2 }}>
                                <ListItemText 
                                    primary={<Typography fontWeight="600">Email Summaries</Typography>}
                                    secondary="Receive daily or weekly summaries of your earnings and performance."
                                />
                                <ListItemSecondaryAction>
                                    <Switch 
                                        edge="end" 
                                        color="primary"
                                        checked={settings.emailAlerts} 
                                        onChange={() => handleToggle('emailAlerts')} 
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                    </SettingSection>

                    <SettingSection title="Appearance" icon={<DarkModeRounded fontSize="small" />}>
                        <List disablePadding>
                            <ListItem sx={{ py: 2 }}>
                                <ListItemText 
                                    primary={<Typography fontWeight="600">Dark Mode</Typography>}
                                    secondary="Switch to a dark theme for a high-contrast, low-glare experience."
                                />
                                <ListItemSecondaryAction>
                                    <Switch 
                                        edge="end" 
                                        color="primary"
                                        checked={mode === 'dark'} 
                                        onChange={toggleColorMode} 
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                    </SettingSection>

                    <SettingSection title="Delivery Preferences" icon={<MapRounded fontSize="small" />}>
                        <List disablePadding>
                            <ListItem sx={{ py: 2 }}>
                                <ListItemText 
                                    primary={<Typography fontWeight="600">Background Location Tracking</Typography>}
                                    secondary="Allow FootVerse to access your location in the background to provide accurate ETAs to customers."
                                />
                                <ListItemSecondaryAction>
                                    <Switch 
                                        edge="end" 
                                        color="secondary"
                                        checked={settings.locationTracking} 
                                        onChange={() => handleToggle('locationTracking')} 
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                            <ListItem sx={{ py: 2 }}>
                                <ListItemText 
                                    primary={<Typography fontWeight="600">Auto-accept Orders</Typography>}
                                    secondary="Automatically accept new delivery assignments when you are online."
                                />
                                <ListItemSecondaryAction>
                                    <Switch 
                                        edge="end" 
                                        color="secondary"
                                        checked={settings.autoAcceptOrders} 
                                        onChange={() => handleToggle('autoAcceptOrders')} 
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                    </SettingSection>

                    <SettingSection title="Account & Security" icon={<SecurityRounded fontSize="small" />}>
                        <List disablePadding>
                            <ListItem sx={{ py: 2 }}>
                                <ListItemText 
                                    primary={<Typography fontWeight="600">Change Password</Typography>}
                                    secondary="Update your account password for enhanced security."
                                />
                                <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>Update</Button>
                            </ListItem>
                            <Divider />
                            <ListItem sx={{ py: 3, bgcolor: 'action.hover' }}>
                                <ListItemText 
                                    primary={<Typography fontWeight="700" color="error">Sign Out</Typography>}
                                    secondary="Log out of your delivery partner account securely."
                                />
                                <Button 
                                    variant="contained" 
                                    color="error" 
                                    onClick={handleLogout}
                                    startIcon={<ExitToAppRounded />}
                                    sx={{ borderRadius: 2 }}
                                >
                                    Log Out
                                </Button>
                            </ListItem>
                        </List>
                    </SettingSection>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <CardContent sx={{ textAlign: 'center', p: 4 }}>
                            <SettingsRounded sx={{ fontSize: 60, color: 'text.disabled', mb: 2, opacity: 0.5 }} />
                            <Typography variant="h6" fontWeight="700" gutterBottom>
                                FootVerse App
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Delivery Partner Portal
                            </Typography>
                            <Chip label="Version 2.4.1" size="small" sx={{ mt: 2, fontWeight: 600 }} />
                            
                            <Divider sx={{ my: 4 }} />
                            
                            <Typography variant="caption" color="text.secondary" display="block">
                                © {new Date().getFullYear()} FootVerse Technologies.
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                All rights reserved.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </DeliveryLayout>
    );
}
