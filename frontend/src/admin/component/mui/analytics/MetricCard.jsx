import React from 'react';
import { Card, Box, Typography, Avatar, Tooltip, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function MetricCard({ 
    title, 
    value, 
    icon, 
    color = "primary", 
    trend, 
    trendValue, 
    subtitle, 
    tooltip 
}) {
    return (
        <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight="600" textTransform="uppercase" letterSpacing={1}>
                            {title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Typography variant="h4" fontWeight="700" color="text.primary">
                                {value}
                            </Typography>
                            {tooltip && (
                                <Tooltip title={tooltip} placement="top">
                                    <IconButton size="small" sx={{ ml: 1, color: 'text.secondary' }}>
                                        <InfoOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                    </Box>
                    
                    <Avatar 
                        variant="rounded" 
                        sx={{ 
                            bgcolor: `${color}.light`, 
                            color: `${color}.main`, 
                            width: 48, 
                            height: 48,
                            opacity: 0.9
                        }}
                    >
                        {icon}
                    </Avatar>
                </Box>
                
                <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
                    {trendValue && (
                        <Typography 
                            variant="body2" 
                            fontWeight="600" 
                            color={trend === 'up' ? 'success.main' : trend === 'down' ? 'error.main' : 'text.secondary'}
                            sx={{ mr: 1, display: 'flex', alignItems: 'center' }}
                        >
                            {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '-'} {trendValue}
                        </Typography>
                    )}
                    {subtitle && (
                        <Typography variant="body2" color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Card>
    );
}
