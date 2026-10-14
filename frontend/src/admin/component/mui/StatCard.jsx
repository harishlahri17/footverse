import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export default function StatCard({ title, value, icon, color = 'primary', trend, trendValue, subtitle }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography color="text.secondary" variant="subtitle2" fontWeight="600" textTransform="uppercase" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" color="text.primary" fontWeight="700">
              {value}
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: `${color}.light`,
              color: `${color}.main`,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Avatar>
        </Box>
        {(trend || subtitle) && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', color: trend === 'up' ? 'success.main' : 'error.main', mr: 1 }}>
                {trend === 'up' ? <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} /> : <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />}
                <Typography variant="body2" fontWeight="600">
                  {trendValue}
                </Typography>
              </Box>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
