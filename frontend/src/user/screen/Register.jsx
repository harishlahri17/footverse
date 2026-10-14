import React from 'react';
import { BaseUrl } from '../../axiosInstance';
import { useAuth } from '../../store/auth';
import { toast } from 'react-toastify';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
    Box, Card, CardContent, Typography, TextField, Button, 
    Link, InputAdornment, IconButton, Container, FormControlLabel, Checkbox 
} from '@mui/material';
import { 
    Visibility, VisibilityOff, EmailOutlined, 
    LockOutlined, PersonOutlined, PhoneOutlined 
} from '@mui/icons-material';
import PasswordStrength from '../../components/common/PasswordStrength';

const registerSchema = z.object({
    fullName: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
    terms: z.boolean().refine(val => val === true, "You must accept the terms and conditions")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const Register = () => {
    const { storeTokenInLS } = useAuth();
    const navigate = useNavigate();
    
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            terms: false,
        }
    });

    const currentPassword = watch("password");

    const onSubmit = async (formData) => {
        try {
            const payload = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            };
            const { data } = await BaseUrl.post("/user/add-user", payload);

            if (data?.Success) {
                toast.success(data?.Message);
                storeTokenInLS(data.token);
                navigate("/home");
            }
        } catch (error) {
            const message = error?.response?.data?.Message;
            if (message === "User already exists with this email") {
                setError("email", { type: "server", message });
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
            <Container maxWidth="sm">
                <Card 
                    sx={{ 
                        borderRadius: 4, 
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                        overflow: 'visible',
                        position: 'relative',
                        mt: 4
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
                    
                    <CardContent sx={{ pt: 7, pb: 4, px: { xs: 3, sm: 5 } }}>
                        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom sx={{ color: '#333' }}>
                            Create Account
                        </Typography>
                        <Typography variant="body2" align="center" color="text.secondary" mb={4}>
                            Join FootVerse to discover amazing footwear
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 0, sm: 2 } }}>
                                <TextField
                                    fullWidth
                                    placeholder="Full Name"
                                    variant="outlined"
                                    margin="normal"
                                    {...register("fullName")}
                                    error={!!errors.fullName}
                                    helperText={errors.fullName?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutlined color={errors.fullName ? "error" : "action"} />
                                            </InputAdornment>
                                        ),
                                        sx: { borderRadius: 3, bgcolor: 'grey.50' }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    placeholder="Phone Number"
                                    variant="outlined"
                                    margin="normal"
                                    {...register("phone")}
                                    error={!!errors.phone}
                                    helperText={errors.phone?.message}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PhoneOutlined color={errors.phone ? "error" : "action"} />
                                            </InputAdornment>
                                        ),
                                        sx: { borderRadius: 3, bgcolor: 'grey.50' }
                                    }}
                                />
                            </Box>

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
                            
                            <PasswordStrength password={currentPassword} />

                            <TextField
                                fullWidth
                                placeholder="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                variant="outlined"
                                margin="normal"
                                {...register("confirmPassword")}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
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
                            
                            <FormControlLabel
                                control={<Checkbox size="small" {...register("terms")} sx={{ color: errors.terms ? 'error.main' : '#667eea', '&.Mui-checked': { color: '#667eea' } }} />}
                                label={<Typography variant="body2" color={errors.terms ? 'error.main' : 'text.secondary'}>I agree to the Terms and Conditions</Typography>}
                                sx={{ mt: 1, mb: 1 }}
                            />
                            {errors.terms && <Typography variant="caption" color="error" sx={{ display: 'block', mt: -1, mb: 1, ml: 4 }}>{errors.terms.message}</Typography>}

                            <Button 
                                type="submit" 
                                fullWidth 
                                variant="contained" 
                                disabled={isSubmitting}
                                sx={{ 
                                    mt: 1, mb: 2, py: 1.5, borderRadius: 3,
                                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                    fontWeight: 'bold', fontSize: '1rem',
                                    textTransform: 'none',
                                    boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
                                    '&:hover': { background: 'linear-gradient(90deg, #5a6edb 0%, #684191 100%)', boxShadow: '0 6px 20px rgba(102, 126, 234, 0.23)' }
                                }}
                            >
                                {isSubmitting ? "Creating Account..." : "Create Account"}
                            </Button>
                        </Box>

                        <Typography variant="body2" align="center" mt={3}>
                            Already have an account?{' '}
                            <Link 
                                component={RouterLink} 
                                to="/" 
                                underline="none" 
                                sx={{ color: '#667eea', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                            >
                                Login
                            </Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

