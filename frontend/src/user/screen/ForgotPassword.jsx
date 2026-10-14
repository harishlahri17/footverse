import React from 'react';
import { BaseUrl } from '../../axiosInstance';
import { toast } from 'react-toastify';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
    Box, Card, CardContent, Typography, TextField, Button, 
    Link, InputAdornment, Container 
} from '@mui/material';
import { EmailOutlined, ArrowBack } from '@mui/icons-material';

const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email format"),
});

export default function ForgotPassword() {
    const [successState, setSuccessState] = React.useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" }
    });

    const onSubmit = async (formData) => {
        try {
            // Note: Update this endpoint if needed based on the backend API
            const { data } = await BaseUrl.post("/user/forgot-password", formData);
            if (data.Success || data.message) {
                toast.success(data.Message || "Reset link sent!");
                setSuccessState(true);
            } else {
                toast.success("If the email is registered, a reset link has been sent.");
                setSuccessState(true);
            }
        } catch (error) {
            toast.error(error?.response?.data?.Message || "Something went wrong! If the email is valid, you'll receive a link.");
            setSuccessState(true); // Typically we don't want to reveal if an email exists for security
        }
    };

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
                    
                    <CardContent sx={{ pt: 7, pb: 4, px: { xs: 3, sm: 4 } }}>
                        {successState ? (
                            <Box textAlign="center">
                                <Typography variant="h5" fontWeight="bold" gutterBottom color="success.main">
                                    Check Your Email
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mb={4}>
                                    We've sent a password reset link to your email address. Please check your inbox.
                                </Typography>
                                <Button 
                                    component={RouterLink} to="/" fullWidth variant="outlined" 
                                    sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600, py: 1.2 }}
                                >
                                    Return to Login
                                </Button>
                            </Box>
                        ) : (
                            <>
                                <Typography variant="h5" align="center" fontWeight="bold" gutterBottom sx={{ color: '#333' }}>
                                    Forgot Password
                                </Typography>
                                <Typography variant="body2" align="center" color="text.secondary" mb={4}>
                                    Enter your email and we'll send you a link to reset your password.
                                </Typography>

                                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                                    <TextField
                                        fullWidth placeholder="Email Address" variant="outlined" margin="normal"
                                        {...register("email")} error={!!errors.email} helperText={errors.email?.message}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailOutlined color={errors.email ? "error" : "action"} />
                                                </InputAdornment>
                                            ),
                                            sx: { borderRadius: 3, bgcolor: 'grey.50' }
                                        }}
                                    />

                                    <Button 
                                        type="submit" fullWidth variant="contained" disabled={isSubmitting}
                                        sx={{ 
                                            mt: 2, mb: 3, py: 1.5, borderRadius: 3,
                                            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                            fontWeight: 'bold', fontSize: '1rem', textTransform: 'none',
                                            boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
                                            '&:hover': { background: 'linear-gradient(90deg, #5a6edb 0%, #684191 100%)', boxShadow: '0 6px 20px rgba(102, 126, 234, 0.23)' }
                                        }}
                                    >
                                        {isSubmitting ? "Sending..." : "Send Reset Link"}
                                    </Button>
                                </Box>

                                <Typography variant="body2" align="center">
                                    <Link component={RouterLink} to="/" underline="none" sx={{ color: 'text.secondary', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, '&:hover': { color: '#667eea' } }}>
                                        <ArrowBack fontSize="small" /> Back to Login
                                    </Link>
                                </Typography>
                            </>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
