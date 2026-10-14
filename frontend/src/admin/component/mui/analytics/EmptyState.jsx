import React from 'react';
import { Box, Typography } from '@mui/material';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';

export default function EmptyState({ 
    icon = <AssessmentOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />, 
    title = "No Data Available",
    message = "There is currently no data to display for this metric.",
    height = 350 
}) {
    return (
        <Box 
            sx={{ 
                height, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: 'action.hover',
                borderRadius: 2,
                p: 3,
                textAlign: 'center'
            }}
        >
            {icon}
            <Typography variant="subtitle1" fontWeight="600" color="text.secondary">
                {title}
            </Typography>
            <Typography variant="body2" color="text.disabled">
                {message}
            </Typography>
        </Box>
    );
}
