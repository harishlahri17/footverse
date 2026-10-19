import React from 'react';
import { Box, Container, Grid, Typography, TextField, Button, IconButton, Link, Stack, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram, YouTube, Pinterest } from '@mui/icons-material';

export default function Footer() {
    return (
        <Box component="footer" sx={{ bgcolor: '#FFFFFF', pt: 8, pb: 4, mt: 'auto', borderTop: '1px solid', borderColor: 'divider' }}>
            <Container maxWidth="xl">
                <Grid container spacing={4} sx={{ mb: 6 }}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mb: 2 }}>
                            FootVerse
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300 }}>
                            Premium footwear for every step of your journey. From athletic performance to everyday comfort.
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Box component="img" src="/img/payment/payment-1.png" alt="Visa" sx={{ height: 24, bgcolor: 'grey.100', p: 0.5, borderRadius: 1 }} />
                            <Box component="img" src="/img/payment/payment-2.png" alt="Mastercard" sx={{ height: 24, bgcolor: 'grey.100', p: 0.5, borderRadius: 1 }} />
                            <Box component="img" src="/img/payment/payment-3.png" alt="PayPal" sx={{ height: 24, bgcolor: 'grey.100', p: 0.5, borderRadius: 1 }} />
                        </Stack>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                            Quick Links
                        </Typography>
                        <Stack spacing={1}>
                            <Link href="#" color="text.secondary" underline="hover">About Us</Link>
                            <Link href="#" color="text.secondary" underline="hover">Blog</Link>
                            <Link href="#" color="text.secondary" underline="hover">Contact</Link>
                            <Link href="#" color="text.secondary" underline="hover">FAQ</Link>
                        </Stack>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                            Account
                        </Typography>
                        <Stack spacing={1}>
                            <Link href="#" color="text.secondary" underline="hover">My Account</Link>
                            <Link href="#" color="text.secondary" underline="hover">Orders Tracking</Link>
                            <Link href="#" color="text.secondary" underline="hover">Checkout</Link>
                            <Link href="#" color="text.secondary" underline="hover">Wishlist</Link>
                        </Stack>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                            Newsletter
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Subscribe to get the latest updates and offers.
                        </Typography>
                        <Box component="form" sx={{ display: 'flex', gap: 1, mb: 3 }}>
                            <TextField 
                                variant="outlined" 
                                size="small" 
                                placeholder="Email address" 
                                fullWidth 
                                sx={{ bgcolor: 'background.default' }}
                            />
                            <Button variant="contained" color="primary" disableElevation>
                                Subscribe
                            </Button>
                        </Box>
                        <Stack direction="row" spacing={1}>
                            <IconButton size="small" sx={{ color: 'text.secondary', bgcolor: 'background.default', '&:hover': { bgcolor: 'primary.light', color: 'white' } }}>
                                <Facebook fontSize="small" />
                            </IconButton>
                            <IconButton size="small" sx={{ color: 'text.secondary', bgcolor: 'background.default', '&:hover': { bgcolor: 'primary.light', color: 'white' } }}>
                                <Twitter fontSize="small" />
                            </IconButton>
                            <IconButton size="small" sx={{ color: 'text.secondary', bgcolor: 'background.default', '&:hover': { bgcolor: 'primary.light', color: 'white' } }}>
                                <Instagram fontSize="small" />
                            </IconButton>
                            <IconButton size="small" sx={{ color: 'text.secondary', bgcolor: 'background.default', '&:hover': { bgcolor: 'primary.light', color: 'white' } }}>
                                <YouTube fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Grid>
                </Grid>
                
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        &copy; {new Date().getFullYear()} FootVerse. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
