import React, { useEffect, useState } from 'react';
import { BaseUrl } from '../../axiosInstance';
import { toast } from 'react-toastify';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, Container, CircularProgress } from '@mui/material';
import { CheckCircleOutlined, ErrorOutlined } from '@mui/icons-material';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link.');
            return;
        }

        const verify = async () => {
            try {
                // Note: Update endpoint if necessary for the backend
                const { data } = await BaseUrl.post("/user/verify-email", { token });
                if (data.Success || data.message) {
                    setStatus('success');
                    setMessage(data.Message || 'Your email has been successfully verified!');
                } else {
                    setStatus('error');
                    setMessage('Verification failed. The link might be expired.');
                }
            } catch (error) {
                setStatus('error');
                setMessage(error?.response?.data?.Message || 'An error occurred during verification.');
            }
        };

        verify();
    }, [token]);

    return (
        <Box 
            sx={{ 
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', p: 2
            }}
        >
            <Container maxWidth="xs">
                <Card sx={{ borderRadius: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative', overflow: 'visible', mt: 4 }}>
                    <Box 
                        sx={{ 
                            position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
                            bgcolor: 'white', p: 1.5, borderRadius: '50%', boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80
                        }}
                    >
                        <Box component="img" src="/assets/img/logo.png" alt="FootVerse Logo" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                        <Typography variant="h5" fontWeight="900" sx={{ position: 'absolute', color: '#667eea', display: 'none' }} className="fallback-text">FV</Typography>
                    </Box>
                    
                    <CardContent sx={{ pt: 7, pb: 4, px: { xs: 3, sm: 4 }, textAlign: 'center' }}>
                        {status === 'loading' && (
                            <Box sx={{ py: 3 }}>
                                <CircularProgress sx={{ color: '#667eea', mb: 2 }} />
                                <Typography variant="h6" fontWeight="bold" color="text.primary">
                                    Verifying...
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {message}
                                </Typography>
                            </Box>
                        )}
                        
                        {status === 'success' && (
                            <Box sx={{ py: 2 }}>
                                <CheckCircleOutlined sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                                <Typography variant="h5" fontWeight="bold" gutterBottom color="success.main">
                                    Verified!
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mb={4}>
                                    {message}
                                </Typography>
                                <Button 
                                    component={RouterLink} to="/" fullWidth variant="contained"
                                    sx={{ 
                                        py: 1.5, borderRadius: 3,
                                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                        fontWeight: 'bold', fontSize: '1rem', textTransform: 'none',
                                    }}
                                >
                                    Proceed to Login
                                </Button>
                            </Box>
                        )}
                        
                        {status === 'error' && (
                            <Box sx={{ py: 2 }}>
                                <ErrorOutlined sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
                                <Typography variant="h5" fontWeight="bold" gutterBottom color="error.main">
                                    Verification Failed
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mb={4}>
                                    {message}
                                </Typography>
                                <Button 
                                    component={RouterLink} to="/" fullWidth variant="outlined" color="error"
                                    sx={{ py: 1.2, borderRadius: 3, fontWeight: 600, textTransform: 'none' }}
                                >
                                    Return to Login
                                </Button>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
