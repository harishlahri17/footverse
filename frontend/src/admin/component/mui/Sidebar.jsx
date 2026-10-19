import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Avatar,
  IconButton,
  ListSubheader
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as OrdersIcon,
  AddBox as AddProductIcon,
  Inventory as ProductsIcon,
  LocalShipping as DeliveryManIcon,
  PersonAdd as AddDeliveryManIcon,
  Star as FeaturedIcon,
  LocalOffer as DiscountIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../store/auth';

const menuSections = [
  {
    title: 'OVERVIEW',
    items: [
      { text: 'Dashboard', icon: <DashboardIcon fontSize="small" />, path: '/dashboard' },
      { text: 'Orders', icon: <OrdersIcon fontSize="small" />, path: '/orders' },
      { text: 'Products List', icon: <ProductsIcon fontSize="small" />, path: '/products-table' },
    ]
  },
  {
    title: 'CATALOG',
    items: [
      { text: 'Add Product', icon: <AddProductIcon fontSize="small" />, path: '/add-product' },
      { text: 'Featured Products', icon: <FeaturedIcon fontSize="small" />, path: '/featured-product' },
      { text: 'Discounts', icon: <DiscountIcon fontSize="small" />, path: '/add-discount' },
    ]
  },
  {
    title: 'DELIVERY',
    items: [
      { text: 'Delivery Partners', icon: <DeliveryManIcon fontSize="small" />, path: '/delivery-man' },
      { text: 'Add Partner', icon: <AddDeliveryManIcon fontSize="small" />, path: '/add-delivery-man' },
    ]
  }
];

export default function Sidebar({ mobileOpen, handleDrawerToggle, drawerWidth }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
        <Box component="img" src="/assets/img/logo.png" alt="Logo" sx={{ height: 32, mr: 1, display: { xs: 'none', sm: 'block' } }} />
        <Typography variant="h6" color="primary" sx={{ fontWeight: '800', letterSpacing: 1 }}>
          FootVerse
        </Typography>
      </Toolbar>
      
      <Divider />
      
      <Box sx={{ overflowY: 'auto', flexGrow: 1, px: 2, pt: 1, pb: 2 }}>
        {menuSections.map((section, index) => (
          <List 
            key={section.title} 
            subheader={
              <ListSubheader 
                component="div" 
                sx={{ 
                  bgcolor: 'transparent', 
                  fontSize: '0.65rem', 
                  fontWeight: 700, 
                  letterSpacing: '0.1em',
                  color: 'text.disabled',
                  lineHeight: '2.5',
                  pt: index === 0 ? 0 : 2
                }}
              >
                {section.title}
              </ListSubheader>
            }
          >
            {section.items.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/orders' && location.pathname === '/admin/orders');
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    selected={isActive}
                    sx={{
                      borderRadius: '8px',
                      py: 1,
                      px: 2,
                      transition: 'all 0.2s ease',
                      borderLeft: isActive ? '3px solid transparent' : '3px solid transparent',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        transform: 'translateX(2px)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: (theme) => `${theme.palette.primary.main} !important`,
                        color: (theme) => `${theme.palette.primary.contrastText} !important`,
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                          transform: 'translateX(0)',
                        },
                        '& .MuiListItemIcon-root': {
                          color: (theme) => `${theme.palette.primary.contrastText} !important`,
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: isActive ? 'inherit' : 'text.secondary' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ 
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 600 : 500 
                      }} 
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        ))}
      </Box>

      <Divider />
      
      {/* Footer / User Profile Area */}
      <Box sx={{ p: 2, pb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '1rem', fontWeight: 600 }}>
          A
        </Avatar>
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            Admin User
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            FootVerse Admin
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleLogout} color="error" title="Logout" sx={{ bgcolor: 'error.light', color: 'error.main', '&:hover': { bgcolor: 'error.main', color: 'white' } }}>
          <LogoutIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, 
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
