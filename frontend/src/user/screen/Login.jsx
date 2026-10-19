import React from 'react';
import { BaseUrl } from '../../axiosInstance';
import { useAuth } from '../../store/auth';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
    Box, Card, CardContent, Typography, TextField, Button, 
    Link, InputAdornment, IconButton, Container, FormControlLabel, Checkbox, Divider
} from '@mui/material';
import { 
    Visibility, VisibilityOff, EmailOutlined, 
    LockOutlined
} from '@mui/icons-material';
import { FcGoogle } from 'react-icons/fc';

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rememberMe: z.boolean().optional(),
});

export default function Login() {
    const { storeTokenInLS } = useAuth();
    const navigate = useNavigate();
    
    const [showPassword, setShowPassword] = React.useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        }
    });

    const onSubmit = async (formData) => {
        try {
            const { data } = await BaseUrl.post("/user/user-login", formData);
            if (data.Success) {
                storeTokenInLS(data.token);
                toast.success(data.Message);

                if (data.role === "admin") {
                    navigate("/dashboard");
                } else if (data.role === "delivery") {
                    navigate("/delivery-dashboard");
                } else {
                    navigate("/home");
                }
            }
        } catch (error) {
            const message = error?.response?.data?.Message;
            if (message === "Invalid Email Or User not exist !") {
                setError("email", { type: "server", message });
            } else if (message === "Invalid Password !") {
                setError("password", { type: "server", message });
            } else {
                toast.error(message || "Something went wrong!");
            }
        }
    };

    return (
        <Box 
            sx={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                p: 2
            }}
        >
            <Container maxWidth="xs">
                <Card 
                    sx={{ 
                        borderRadius: 4, 
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                        overflow: 'visible',
                        position: 'relative'
                    }}
                >
                    <Box 
                        sx={{ 
                            position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
                            bgcolor: 'white', p: 1.5, borderRadius: '50%', 
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 80, height: 80
                        }}
                    >
                        <Box component="img" src="/assets/img/logo.png" alt="FootVerse Logo" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                        <Typography variant="h5" fontWeight="900" sx={{ position: 'absolute', color: '#667eea', display: 'none' }} className="fallback-text">FV</Typography>
                    </Box>
                    
                    <CardContent sx={{ pt: 7, pb: 4, px: { xs: 3, sm: 4 } }}>
                        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom sx={{ color: '#333' }}>
                            Welcome Back
                        </Typography>
                        <Typography variant="body2" align="center" color="text.secondary" mb={4}>
                            Login to your FootVerse account
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                            <TextField
                                fullWidth
                                placeholder="Email Address"
                                variant="outlined"
                                margin="normal"
                                {...register("email")}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailOutlined color={errors.email ? "error" : "action"} />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: 3, bgcolor: 'grey.50' }
                                }}
                            />

                            <TextField
                                fullWidth
                                placeholder="Password"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                margin="normal"
                                {...register("password")}
                                error={!!errors.password}
                                helperText={errors.password?.message}
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

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 2 }}>
                                <FormControlLabel
                                    control={<Checkbox size="small" {...register("rememberMe")} sx={{ color: '#667eea', '&.Mui-checked': { color: '#667eea' } }} />}
                                    label={<Typography variant="body2" color="text.secondary">Remember me</Typography>}
                                />
                                <Link 
                                    component={RouterLink} 
                                    to="/forgot-password" 
                                    underline="hover" 
                                    sx={{ color: '#667eea', fontSize: '0.875rem', fontWeight: 500 }}
                                >
                                    Forgot Password?
                                </Link>
                            </Box>

                            <Button 
                                type="submit" 
                                fullWidth 
                                variant="contained" 
                                disabled={isSubmitting}
                                sx={{ 
                                    mb: 2, py: 1.5, borderRadius: 3,
                                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                    fontWeight: 'bold', fontSize: '1rem',
                                    textTransform: 'none',
                                    boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
                                    '&:hover': { background: 'linear-gradient(90deg, #5a6edb 0%, #684191 100%)', boxShadow: '0 6px 20px rgba(102, 126, 234, 0.23)' }
                                }}
                            >
                                {isSubmitting ? "Logging in..." : "Login"}
                            </Button>
                            
                            <Divider sx={{ my: 3 }}>
                                <Typography variant="body2" color="text.secondary">OR</Typography>
                            </Divider>

                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<FcGoogle size={24} />}
                                sx={{ 
                                    py: 1.2, borderRadius: 3, borderColor: 'grey.300',
                                    color: 'text.primary', fontWeight: 600, textTransform: 'none',
                                    '&:hover': { borderColor: 'grey.400', bgcolor: 'grey.50' }
                                }}
                                onClick={() => toast.info('Google login coming soon!')}
                            >
                                Continue with Google
                            </Button>
                        </Box>

                        <Typography variant="body2" align="center" mt={4}>
                            Don't have an account?{' '}
                            <Link 
                                component={RouterLink} 
                                to="/register" 
                                underline="none" 
                                sx={{ color: '#667eea', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                            >
                                Register
                            </Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
