import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

const PasswordStrength = ({ password }) => {
    // calculate strength
    let strength = 0;
    if (password.length > 5) strength += 20;
    if (password.length > 7) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    let color = 'error';
    let label = 'Weak';
    
    if (strength >= 80) {
        color = 'success';
        label = 'Strong';
    } else if (strength >= 60) {
        color = 'warning';
        label = 'Good';
    } else if (strength >= 40) {
        color = 'warning';
        label = 'Fair';
    }

    return (
        <Box sx={{ mt: 1, mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                    Password Strength
                </Typography>
                <Typography variant="caption" color={`${color}.main`} fontWeight="bold">
                    {password ? label : ''}
                </Typography>
            </Box>
            <LinearProgress 
                variant="determinate" 
                value={password ? strength : 0} 
                color={color}
                sx={{ height: 6, borderRadius: 3, bgcolor: 'grey.200' }}
            />
        </Box>
    );
};

export default PasswordStrength;
