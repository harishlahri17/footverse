import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import EmptyState from './EmptyState';

export default function SalesChart({ orders = [] }) {
    const theme = useTheme();

    // Transform existing orders into time-series data
    const chartData = useMemo(() => {
        if (!orders || orders.length === 0) return [];

        // Group by Date (formatted as MMM DD)
        const dateMap = {};

        orders.forEach(order => {
            if (!order || !order.createdAt) return;
            const dateObj = new Date(order.createdAt);
            if (isNaN(dateObj.getTime())) return;

            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            if (!dateMap[dateStr]) {
                dateMap[dateStr] = {
                    date: dateStr,
                    timestamp: dateObj.getTime(), // For sorting
                    revenue: 0,
                    orders: 0
                };
            }

            const revenueAmount = Number(order.subtotal !== undefined ? order.subtotal : (order.subTotal !== undefined ? order.subTotal : order.total)) || 0;
            dateMap[dateStr].revenue += revenueAmount;
            dateMap[dateStr].orders += 1;
        });

        // Convert map to array and sort by date
        return Object.values(dateMap).sort((a, b) => a.timestamp - b.timestamp);
    }, [orders]);

    if (chartData.length === 0) {
        return (
            <EmptyState 
                title="No Sales Data"
                message="Wait for orders to be placed to see sales trends here."
                height={350}
            />
        );
    }

    return (
        <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <LineChart
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                    <XAxis 
                        dataKey="date" 
                        stroke={theme.palette.text.secondary} 
                        tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                        tickMargin={10}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis 
                        yAxisId="left"
                        stroke={theme.palette.text.secondary} 
                        tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        stroke={theme.palette.text.secondary} 
                        tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: theme.palette.background.paper, 
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 8,
                            boxShadow: theme.shadows[3]
                        }}
                        labelStyle={{ color: theme.palette.text.primary, fontWeight: 'bold', marginBottom: 4 }}
                        itemStyle={{ fontWeight: 500 }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 20 }} />
                    <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="revenue" 
                        name="Revenue" 
                        stroke={theme.palette.primary.main} 
                        strokeWidth={3}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                        dot={{ r: 4, strokeWidth: 2, fill: theme.palette.background.paper }}
                    />
                    <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="orders" 
                        name="Orders" 
                        stroke={theme.palette.success.main} 
                        strokeWidth={3}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                        dot={{ r: 4, strokeWidth: 2, fill: theme.palette.background.paper }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
