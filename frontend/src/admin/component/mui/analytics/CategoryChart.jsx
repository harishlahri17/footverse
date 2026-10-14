import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import EmptyState from './EmptyState';

export default function CategoryChart({ products = [] }) {
    const theme = useTheme();

    const chartData = useMemo(() => {
        if (!products || products.length === 0) return [];

        // Count occurrences of each category/type
        // We prioritize 'type' as it has more granularity (sneakers, casual, formal, etc.)
        // but if type is missing, fallback to category.
        const counts = {};

        products.forEach(product => {
            if (!product) return;
            const key = product.type || product.category || 'Other';
            // Capitalize for display
            const displayKey = key ? (key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()) : 'Other';
            counts[displayKey] = (counts[displayKey] || 0) + 1;
        });

        const data = Object.keys(counts).map(key => ({
            name: key,
            count: counts[key]
        })).sort((a, b) => b.count - a.count); // Highest count first

        return data;
    }, [products]);

    // Use a horizontal bar chart if there are many categories to ensure labels fit
    const isHorizontal = chartData.length > 5;

    if (chartData.length === 0) {
        return (
            <EmptyState 
                title="No Product Categories"
                message="Add products to see the category distribution."
                height={350}
            />
        );
    }

    return (
        <Box sx={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <BarChart
                    data={chartData}
                    layout={isHorizontal ? "vertical" : "horizontal"}
                    margin={{
                        top: 20,
                        right: 30,
                        left: isHorizontal ? 40 : 20, // Extra space for horizontal labels
                        bottom: 5,
                    }}
                >
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke={theme.palette.divider} 
                        vertical={!isHorizontal} 
                        horizontal={isHorizontal} 
                    />
                    
                    <XAxis 
                        type={isHorizontal ? "number" : "category"}
                        dataKey={isHorizontal ? undefined : "name"}
                        stroke={theme.palette.text.secondary} 
                        tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    
                    <YAxis 
                        type={isHorizontal ? "category" : "number"}
                        dataKey={isHorizontal ? "name" : undefined}
                        stroke={theme.palette.text.secondary} 
                        tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        width={isHorizontal ? 80 : 40}
                    />
                    
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: theme.palette.background.paper, 
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 8,
                            boxShadow: theme.shadows[3]
                        }}
                        cursor={{ fill: theme.palette.action.hover }}
                        itemStyle={{ fontWeight: 600, color: theme.palette.primary.main }}
                        formatter={(value) => [value, 'Products']}
                    />
                    
                    <Bar 
                        dataKey="count" 
                        name="Products" 
                        radius={isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]} 
                        barSize={32}
                    >
                        {chartData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={index === 0 ? theme.palette.primary.main : theme.palette.info.light} 
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
}
