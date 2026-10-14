import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Stack } from '@mui/material';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import EmptyState from './EmptyState';

export default function OrderStatusChart({ orders = [] }) {
    const theme = useTheme();

    // Map order statuses to counts and colors
    const { chartData, totalOrders } = useMemo(() => {
        if (!orders || orders.length === 0) return { chartData: [], totalOrders: 0 };

        const statusCounts = {};
        orders.forEach(order => {
            if (!order) return;
            const status = order.orderStatus || 'Unknown';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        // A consistent color palette for typical order statuses
        const getStatusColor = (status, index) => {
            const s = status.toLowerCase();
            if (s.includes('pending')) return theme.palette.warning.main;
            if (s.includes('delivered')) return theme.palette.success.main;
            if (s.includes('cancelled') || s.includes('returned') || s.includes('rejected')) return theme.palette.error.main;
            if (s.includes('shipped') || s.includes('out_for_delivery')) return theme.palette.info.main;
            
            // Fallback colorful palette based on index
            const colors = [
                theme.palette.primary.main,
                '#8b5cf6', // Violet
                '#ec4899', // Pink
                '#14b8a6', // Teal
                '#f97316', // Orange
            ];
            return colors[index % colors.length];
        };

        const data = Object.keys(statusCounts).map((status, index) => ({
            name: status,
            value: statusCounts[status],
            color: getStatusColor(status, index)
        })).sort((a, b) => b.value - a.value); // Sort largest slice first

        return { chartData: data, totalOrders: orders.length };
    }, [orders, theme]);

    if (chartData.length === 0) {
        return (
            <EmptyState 
                title="No Status Data"
                message="Wait for orders to be processed to see the breakdown."
                height={350}
            />
        );
    }

    return (
        <Box sx={{ width: '100%', height: 350, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 1, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={110}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: theme.palette.background.paper, 
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 8,
                                boxShadow: theme.shadows[3]
                            }}
                            itemStyle={{ fontWeight: 600, color: theme.palette.text.primary }}
                            formatter={(value) => [value, 'Orders']}
                        />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Value Overlay */}
                <Box 
                    sx={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        pointerEvents: 'none'
                    }}
                >
                    <Typography variant="h5" fontWeight="700" color="text.primary">
                        {totalOrders}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Total
                    </Typography>
                </Box>
            </Box>

            {/* Custom Legend to fit exactly below */}
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
                {chartData.map((entry, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: entry.color, mr: 1 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                            {entry.name} ({entry.value})
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
