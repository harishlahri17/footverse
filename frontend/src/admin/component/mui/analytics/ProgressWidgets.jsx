import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, LinearProgress, Stack, Paper } from '@mui/material';

export default function ProgressWidgets({ orders = [], products = [] }) {
    const theme = useTheme();

    const stats = useMemo(() => {
        let delivered = 0;
        let inStock = 0;

        (orders || []).forEach(order => {
            if (order && (order.orderStatus || '').toLowerCase() === 'delivered') {
                delivered++;
            }
        });

        (products || []).forEach(product => {
            if (product && (product.stock !== undefined ? product.stock > 0 : true)) {
                inStock++;
            }
        });

        const totalOrders = orders?.length || 0;
        const totalProducts = products?.length || 0;

        const fulfillmentRate = totalOrders > 0 ? (delivered / totalOrders) * 100 : 0;
        const inStockRate = totalProducts > 0 ? (inStock / totalProducts) * 100 : 0;

        return {
            totalOrders,
            delivered,
            fulfillmentRate,
            
            totalProducts,
            inStock,
            inStockRate
        };
    }, [orders, products]);

    return (
        <Stack spacing={3}>
            {/* Fulfillment Progress */}
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="600">Order Fulfillment</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {stats.delivered} / {stats.totalOrders} ({Math.round(stats.fulfillmentRate)}%)
                    </Typography>
                </Box>
                <LinearProgress 
                    variant="determinate" 
                    value={stats.fulfillmentRate} 
                    color="success"
                    sx={{ height: 8, borderRadius: 4, bgcolor: theme.palette.action.hover }}
                />
            </Box>

            {/* Stock Availability */}
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="600">Stock Availability</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {stats.inStock} / {stats.totalProducts} ({Math.round(stats.inStockRate)}%)
                    </Typography>
                </Box>
                <LinearProgress 
                    variant="determinate" 
                    value={stats.inStockRate} 
                    color="primary"
                    sx={{ height: 8, borderRadius: 4, bgcolor: theme.palette.action.hover }}
                />
            </Box>
        </Stack>
    );
}
