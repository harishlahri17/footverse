import React from 'react';
import { 
  Box, Container, Grid, Typography, TextField, Button, 
  Card, CardContent, IconButton, useTheme 
} from '@mui/material';
import { 
  LocationOnOutlined, PhoneOutlined, EmailOutlined, 
  Send, ChatOutlined 
} from '@mui/icons-material';
import Breadcrumb from '../../components/common/Breadcrumb';

export default function Contact() {
  const theme = useTheme();

  const contactMethods = [
    {
      icon: <ChatOutlined fontSize="large" color="primary" />,
      title: "Live Chat",
      desc: "Chat with our support team",
      action: "Start Chat",
      color: "primary.main",
      bg: "primary.50"
    },
    {
      icon: <EmailOutlined fontSize="large" color="secondary" />,
      title: "Email Us",
      desc: "support@footverse.com",
      action: "Send Email",
      color: "secondary.main",
      bg: "secondary.50"
    },
    {
      icon: <PhoneOutlined fontSize="large" color="success" />,
      title: "Call Us",
      desc: "1-800-FOOTVERSE",
      action: "Call Now",
      color: "success.main",
      bg: "success.50"
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
      {/* Header Banner */}
      <Box sx={{ bgcolor: 'primary.900', color: 'white', pt: 8, pb: 12, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Breadcrumb items={[{ label: 'Contact Us' }]} />
          <Typography variant="h2" fontWeight={800} mt={2} mb={2}>We're Here to Help.</Typography>
          <Typography variant="h6" fontWeight={400} sx={{ opacity: 0.9, maxWidth: 600 }}>
            Have a question, feedback, or need assistance with your order? Reach out to us through any of the channels below.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -6, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4}>
          
          {/* Left: Contact Methods & Map */}
          <Grid item xs={12} lg={5}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {contactMethods.map((method, i) => (
                <Grid item xs={12} sm={4} lg={12} key={i}>
                  <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', p: 3 }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: method.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 3 }}>
                      {method.icon}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight={800}>{method.title}</Typography>
                      <Typography variant="body2" color="text.secondary" mb={1}>{method.desc}</Typography>
                    </Box>
                    <Button variant="text" sx={{ color: method.color, fontWeight: 700 }}>
                      {method.action}
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Map */}
            <Card sx={{ borderRadius: 4, overflow: 'hidden', height: 300, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.83543450937!2d144.9537353153162!3d-37.81720974202124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2sbd!4v1575917275626!5m2!1sen!2sbd"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" title="Location Map"
              ></iframe>
            </Card>
          </Grid>

          {/* Right: Contact Form */}
          <Grid item xs={12} lg={7}>
            <Card sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.08)', height: '100%' }}>
              <Typography variant="h4" fontWeight={800} mb={1}>Send us a Message</Typography>
              <Typography variant="body1" color="text.secondary" mb={4}>
                Fill out the form below and our team will get back to you within 24 hours.
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    label="Full Name" 
                    fullWidth 
                    variant="outlined" 
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    label="Email Address" 
                    fullWidth 
                    variant="outlined" 
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    label="Phone Number (Optional)" 
                    fullWidth 
                    variant="outlined" 
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    label="Order Number (Optional)" 
                    fullWidth 
                    variant="outlined" 
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    label="Subject" 
                    fullWidth 
                    variant="outlined" 
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    label="Message" 
                    fullWidth 
                    multiline 
                    rows={5}
                    variant="outlined" 
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    size="large" 
                    endIcon={<Send />}
                    sx={{ py: 1.5, px: 4, borderRadius: 8, fontSize: '1.1rem', fontWeight: 'bold' }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
