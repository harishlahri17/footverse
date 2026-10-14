import React, { useState } from 'react';
import { 
  Box, Container, Typography, Card, Divider, Button, 
  IconButton, List, ListItem, ListItemIcon, ListItemText,
  Tabs, Tab
} from '@mui/material';
import { 
  LocalShippingOutlined, CheckCircleOutlined, 
  LocalOfferOutlined, FiberNewOutlined, DeleteOutlined,
  DoneAllOutlined
} from '@mui/icons-material';
import Breadcrumb from '../../components/common/Breadcrumb';

export default function Notifications() {
  const [tabIndex, setTabIndex] = useState(0);

  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      type: 'shipping', 
      title: "Your order #1234 has been shipped", 
      desc: "Track your order for live updates.", 
      time: "10 min ago", 
      unread: true,
      icon: <LocalShippingOutlined color="info" />
    },
    { 
      id: 2, 
      type: 'promo', 
      title: "New Nike arrivals are here!", 
      desc: "Check out the latest sneakers from Nike.", 
      time: "2 hours ago", 
      unread: true,
      icon: <FiberNewOutlined color="secondary" />
    },
    { 
      id: 3, 
      type: 'success', 
      title: "Your order #1233 has been delivered", 
      desc: "We hope you enjoy your new shoes!", 
      time: "1 day ago", 
      unread: false,
      icon: <CheckCircleOutlined color="success" />
    },
    { 
      id: 4, 
      type: 'promo', 
      title: "20% OFF on selected running shoes", 
      desc: "Use code RUN20 at checkout.", 
      time: "2 days ago", 
      unread: false,
      icon: <LocalOfferOutlined color="error" />
    }
  ]);

  const filteredNotifications = tabIndex === 0 
    ? notifications 
    : tabIndex === 1 
      ? notifications.filter(n => n.unread) 
      : notifications.filter(n => n.type === 'promo');

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      <Container maxWidth="md" sx={{ pt: 4 }}>
        <Breadcrumb items={[{ label: 'Notifications' }]} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, mt: 2 }}>
          <Typography variant="h3" fontWeight={800}>Notifications</Typography>
          <Button 
            startIcon={<DoneAllOutlined />} 
            onClick={markAllRead}
            disabled={!notifications.some(n => n.unread)}
          >
            Mark all as read
          </Button>
        </Box>

        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Tabs 
            value={tabIndex} 
            onChange={(e, v) => setTabIndex(v)} 
            sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}
          >
            <Tab label="All" sx={{ fontWeight: 'bold' }} />
            <Tab label="Unread" sx={{ fontWeight: 'bold' }} />
            <Tab label="Promotions" sx={{ fontWeight: 'bold' }} />
          </Tabs>

          {filteredNotifications.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">No notifications found.</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {filteredNotifications.map((notif, index) => (
                <React.Fragment key={notif.id}>
                  <ListItem 
                    sx={{ 
                      py: 3, px: 4, 
                      bgcolor: notif.unread ? 'primary.50' : 'transparent',
                      transition: 'background-color 0.3s'
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 48 }}>
                      <Box sx={{ 
                        width: 40, height: 40, borderRadius: '50%', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        {notif.icon}
                      </Box>
                    </ListItemIcon>
                    
                    <ListItemText 
                      primary={notif.title} 
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" color="text.primary" display="block" sx={{ mt: 0.5 }}>
                            {notif.desc}
                          </Typography>
                          <Typography component="span" variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                            {notif.time}
                          </Typography>
                        </React.Fragment>
                      }
                      primaryTypographyProps={{ variant: 'subtitle1', fontWeight: notif.unread ? 800 : 600 }}
                    />
                    
                    <IconButton onClick={() => removeNotification(notif.id)} sx={{ ml: 2, color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
                      <DeleteOutlined />
                    </IconButton>
                  </ListItem>
                  {index < filteredNotifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Card>
      </Container>
    </Box>
  );
}
