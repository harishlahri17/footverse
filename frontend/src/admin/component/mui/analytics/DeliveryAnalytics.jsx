import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Box, Typography, Paper, Divider } from '@mui/material';
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
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MopedIcon from '@mui/icons-material/Moped';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { MetricCard } from './index';
import EmptyState from './EmptyState';

export default function DeliveryAnalytics({ orders = [], deliveryPartners = [] }) {
    const theme = useTheme();

    const { kpis, workloadData } = useMemo(() => {
        let assigned = 0;
        let outForDelivery = 0;
        let completed = 0;
        
        // Track orders per delivery partner
        const partnerWorkload = {};

        // Initialize partner workload with 0
        deliveryPartners.forEach(p => {
            if (!p) return;
            const partnerId = p._id || p.id;
            if (partnerId) {
                partnerWorkload[partnerId] = {
                    name: p.fullName || p.name || 'Agent',
                    activeOrders: 0,
                    completedOrders: 0
                };
            }
        });

        // Calculate partner workload
        orders.forEach(order => {
            if (!order) return;
            const status = (order.orderStatus || '').toLowerCase();
            
            // Calculate KPIs
            if (['assigned', 'packed', 'shipped', 'picked_up'].includes(status)) {
                assigned++;
            } else if (['out_for_delivery', 'reached_customer'].includes(status)) {
                outForDelivery++;
            } else if (status === 'delivered') {
                completed++;
            }

            // Calculate partner workload safely
            let pId = null;
            if (order.deliveryPartnerId && typeof order.deliveryPartnerId === 'object') {
                pId = order.deliveryPartnerId._id?.toString() || order.deliveryPartnerId.id?.toString();
            } else if (order.deliveryPartnerId && typeof order.deliveryPartnerId === 'string') {
                pId = order.deliveryPartnerId;
            }
            
            if (pId && partnerWorkload[pId]) {
                if (status === 'delivered') {
                    partnerWorkload[pId].completedOrders++;
                } else if (!['cancelled', 'returned', 'pending', 'placed', 'confirmed'].includes(status)) {
                    partnerWorkload[pId].activeOrders++;
                }
            }
        });

        // Convert to array for charting, filter out those with 0 orders (optional, or show all if small team)
        const workloadArray = Object.values(partnerWorkload)
            .filter(w => w.activeOrders > 0 || w.completedOrders > 0)
            .sort((a, b) => (b.activeOrders + b.completedOrders) - (a.activeOrders + a.completedOrders))
            .slice(0, 10); // Show top 10 agents

        return {
            kpis: { assigned, outForDelivery, completed },
            workloadData: workloadArray
        };
    }, [orders, deliveryPartners]);

    return (
        <Box sx={{ width: '100%' }}>
            {/* KPI Mini Row */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 2, 
                            border: `1px solid ${theme.palette.divider}`, 
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <Box sx={{ p: 1, bgcolor: 'info.light', color: 'info.main', borderRadius: 1.5, display: 'flex' }}>
                            <AssignmentTurnedInIcon />
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Assigned / In Transit</Typography>
                            <Typography variant="h5" fontWeight="600">{kpis.assigned}</Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 2, 
                            border: `1px solid ${theme.palette.divider}`, 
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <Box sx={{ p: 1, bgcolor: 'warning.light', color: 'warning.main', borderRadius: 1.5, display: 'flex' }}>
                            <MopedIcon />
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Out for Delivery</Typography>
                            <Typography variant="h5" fontWeight="600">{kpis.outForDelivery}</Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 2, 
                            border: `1px solid ${theme.palette.divider}`, 
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <Box sx={{ p: 1, bgcolor: 'success.light', color: 'success.main', borderRadius: 1.5, display: 'flex' }}>
                            <LocalShippingIcon />
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Successfully Delivered</Typography>
                            <Typography variant="h5" fontWeight="600">{kpis.completed}</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Workload Chart */}
            <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                Delivery Agent Workload & Performance
            </Typography>
            
            {workloadData.length === 0 ? (
                <EmptyState 
                    title="No Delivery Assignments"
                    message="There are currently no active or completed assignments for any agents."
                    height={280}
                />
            ) : (
                <Box sx={{ width: '100%', height: 280 }}>
                    <ResponsiveContainer>
                        <BarChart
                            data={workloadData}
                            margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                            <XAxis 
                                dataKey="name" 
                                stroke={theme.palette.text.secondary} 
                                tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(val) => val.split(' ')[0]} // Show first name only if too long
                            />
                            <YAxis 
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
                                cursor={{ fill: theme.palette.action.hover }}
                                itemStyle={{ fontWeight: 600 }}
                            />
                            {/* Stacked Bars for Workload */}
                            <Bar dataKey="completedOrders" name="Delivered" stackId="a" fill={theme.palette.success.main} radius={[0, 0, 4, 4]} barSize={40} />
                            <Bar dataKey="activeOrders" name="Active / Pending" stackId="a" fill={theme.palette.info.main} radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </Box>
    );
}
