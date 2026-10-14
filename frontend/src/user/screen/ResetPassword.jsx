import React, { useState } from 'react';
import { BaseUrl } from '../../axiosInstance';
import { toast } from 'react-toastify';
import { Link as RouterLink, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
    Box, Card, CardContent, Typography, TextField, Button, 
    Link, InputAdornment, IconButton, Container 
} from '@mui/material';
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import PasswordStrength from '../../components/common/PasswordStrength';

const resetPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    // Typical reset flows might use a token from the URL like /reset-password?token=XYZ
    const token = searchParams.get('token'); 
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" }
    });

    const currentPassword = watch("password");

    const onSubmit = async (formData) => {
        if (!token) {
            toast.error("Invalid or missing reset token");
            return;
        }
        
        try {
            const { data } = await BaseUrl.post("/user/reset-password", { 
                password: formData.password,
                token 
            });
            if (data.Success || data.message) {
                toast.success(data.Message || "Password reset successfully!");
                navigate("/");
            }
        } catch (error) {
            toast.error(error?.response?.data?.Message || "Failed to reset password. The link might be expired.");
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
                        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom sx={{ color: '#333' }}>
                            Reset Password
                        </Typography>
                        <Typography variant="body2" align="center" color="text.secondary" mb={4}>
                            Enter your new password below.
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                            <TextField
                                fullWidth placeholder="New Password" type={showPassword ? 'text' : 'password'}
                                variant="outlined" margin="normal"
                                {...register("password")} error={!!errors.password} helperText={errors.password?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlined color={errors.password ? "error" : "action"} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: 3, bgcolor: 'grey.50' }
                                }}
                            />
                            
                            <PasswordStrength password={currentPassword} />

                            <TextField
                                fullWidth placeholder="Confirm Password" type={showConfirmPassword ? 'text' : 'password'}
                                variant="outlined" margin="normal"
                                {...register("confirmPassword")} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlined color={errors.confirmPassword ? "error" : "action"} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: 3, bgcolor: 'grey.50' }
                                }}
                            />

                            <Button 
                                type="submit" fullWidth variant="contained" disabled={isSubmitting}
                                sx={{ 
                                    mt: 3, mb: 3, py: 1.5, borderRadius: 3,
                                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                    fontWeight: 'bold', fontSize: '1rem', textTransform: 'none',
                                    boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
                                    '&:hover': { background: 'linear-gradient(90deg, #5a6edb 0%, #684191 100%)', boxShadow: '0 6px 20px rgba(102, 126, 234, 0.23)' }
                                }}
                            >
                                {isSubmitting ? "Resetting..." : "Reset Password"}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
