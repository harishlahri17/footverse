import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import EmptyState from './EmptyState';

export default function PaymentChart({ orders = [] }) {
    const theme = useTheme();

    const { chartData, totalOrders } = useMemo(() => {
        if (!orders || orders.length === 0) return { chartData: [], totalOrders: 0 };

        const counts = {};
        orders.forEach(order => {
            if (!order) return;
            // Use the payment mode exactly as defined by the application
            const mode = order.paymentMode || 'Unknown';
            counts[mode] = (counts[mode] || 0) + 1;
        });

        const getPaymentColor = (mode, index) => {
            const m = mode.toLowerCase();
            if (m.includes('cod') || m.includes('cash')) return theme.palette.warning.main;
            if (m.includes('upi')) return theme.palette.info.main;
            if (m.includes('card')) return theme.palette.secondary.main;
            
            const colors = [
                theme.palette.primary.main,
                theme.palette.success.main,
                '#8b5cf6',
                '#f97316'
            ];
            return colors[index % colors.length];
        };

        const data = Object.keys(counts).map((mode, index) => ({
            name: mode,
            value: counts[mode],
            color: getPaymentColor(mode, index)
        })).sort((a, b) => b.value - a.value);

        return { chartData: data, totalOrders: orders.length };
    }, [orders, theme]);

    if (chartData.length === 0) {
        return (
            <EmptyState 
                title="No Payment Data"
                message="Wait for orders to process payments."
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
                            innerRadius={65}
                            outerRadius={105}
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
                    <Typography variant="h6" fontWeight="700" color="text.primary">
                        {totalOrders}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Payments
                    </Typography>
                </Box>
            </Box>

            {/* Custom Legend */}
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                {chartData.map((entry, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: entry.color, mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            {entry.name} <Typography component="span" fontWeight="600" color="text.primary">({entry.value})</Typography>
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
