import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../store/cartContext';
import { useAuth } from '../../store/auth';
import { toast } from "react-toastify";
import { 
    AppBar, Toolbar, IconButton, Typography, Badge, Button, 
    Box, Menu, MenuItem, Container, Drawer, List, ListItem, ListItemText, Divider, ListItemIcon
} from '@mui/material';
import { 
    Menu as MenuIcon, Search as SearchIcon, FavoriteBorder, 
    ShoppingBagOutlined, PersonOutline, LocalShippingOutlined, Logout
} from '@mui/icons-material';
import UserProfile from './UserProfile';
import MyOrders from './MyOrders';

export default function Header() {
    const navigate = useNavigate();
    const { logoutUser, token } = useAuth();
    
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);

    const { cart } = useCart();
    const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const handleLogout = () => {
        handleMenuClose();
        logoutUser();
        toast.success("Logout successful");
        navigate("/");
    };

    const navItems = [
        { label: 'Home', path: '/home' },
        { label: 'Shop', path: '/shop' },
        { label: 'Blog', path: '/blog' },
        { label: 'Contact', path: '/contact' },
    ];

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2, fontWeight: 'bold', color: 'primary.main' }}>
                FOOTVERSE
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <Button sx={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate(item.path)}>
                            {item.label}
                        </Button>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 80 }}>
                        {/* Mobile Menu Icon */}
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>

                        {/* Logo */}
                        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/home')}>
                            {/* Assuming logo.png exists in public folder, or just use Text */}
                            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: 'primary.main' }}>
                                FOOTVERSE
                            </Typography>
                        </Box>

                        {/* Desktop Navigation */}
                        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
                            {navItems.map((item) => (
                                <Button 
                                    key={item.label} 
                                    onClick={() => navigate(item.path)}
                                    sx={{ color: 'text.primary', fontWeight: 600, '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}
                                    disableRipple
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>

                        {/* Right Icons */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton sx={{ color: 'text.primary' }}>
                                <SearchIcon />
                            </IconButton>
                            
                            <IconButton sx={{ color: 'text.primary' }}>
                                <Badge badgeContent={2} color="error">
                                    <FavoriteBorder />
                                </Badge>
                            </IconButton>

                            <IconButton sx={{ color: 'text.primary' }} onClick={() => navigate("/shop-cart")}>
                                <Badge badgeContent={cartCount} color="primary">
                                    <ShoppingBagOutlined />
                                </Badge>
                            </IconButton>

                            {token ? (
                                <>
                                    <Button 
                                        onClick={handleMenuOpen} 
                                        sx={{ ml: 1, color: 'text.primary', display: { xs: 'none', md: 'flex' }, gap: 1 }}
                                        variant="outlined"
                                        size="small"
                                        startIcon={<PersonOutline />}
                                    >
                                        Account
                                    </Button>
                                    <IconButton 
                                        onClick={handleMenuOpen}
                                        sx={{ display: { xs: 'flex', md: 'none' }, color: 'text.primary' }}
                                    >
                                        <PersonOutline />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                        PaperProps={{
                                            elevation: 0,
                                            sx: {
                                                overflow: 'visible',
                                                filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.1))',
                                                mt: 1.5,
                                                minWidth: 200,
                                                borderRadius: 2
                                            },
                                        }}
                                    >
                                        <MenuItem onClick={() => { handleMenuClose(); setShowProfileModal(true); }}>
                                            <ListItemIcon><PersonOutline fontSize="small" /></ListItemIcon>
                                            My Profile
                                        </MenuItem>
                                        <MenuItem onClick={() => { handleMenuClose(); setShowOrderModal(true); }}>
                                            <ListItemIcon><LocalShippingOutlined fontSize="small" /></ListItemIcon>
                                            My Orders
                                        </MenuItem>
                                        <Divider />
                                        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                                            <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={() => navigate("/")}
                                    sx={{ ml: 2, display: { xs: 'none', md: 'flex' } }}
                                >
                                    Login
                                </Button>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
                }}
            >
                {drawer}
            </Drawer>

            <UserProfile
                showProfileModal={showProfileModal}
                setShowProfileModal={setShowProfileModal}
            />
            <MyOrders 
                showOrderModal={showOrderModal}
                setShowOrderModal={setShowOrderModal}
            />
        </>
    );
}
