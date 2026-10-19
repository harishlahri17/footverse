import React, { useEffect, useState } from 'react';
import { Grid, Box, CircularProgress, Typography } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PageHeader from '../component/mui/PageHeader';
import { MetricCard, AnalyticsCard, SalesChart, OrderStatusChart, CategoryChart, TopProducts, DeliveryAnalytics, ProgressWidgets, PaymentChart } from '../component/mui/analytics';
import { BaseUrl } from '../../axiosInstance';
import { Skeleton, Alert, Button } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

const DashboardSkeleton = () => (
    <Grid container spacing={3}>
        {/* KPI Skeletons */}
        {[1, 2, 3, 4].map(i => (
            <Grid item xs={12} sm={6} md={3} key={`kpi-${i}`}>
                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
            </Grid>
        ))}
        {/* Main Charts Skeletons */}
        <Grid item xs={12} lg={8}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        </Grid>
        <Grid item xs={12} lg={4}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        </Grid>
        {/* Business Charts Skeletons */}
        <Grid item xs={12} lg={8}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        </Grid>
        <Grid item xs={12} lg={4}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        </Grid>
    </Grid>
);

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalDeliveryPartners: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        rawOrders: [], // Raw orders data for charting
        rawProducts: [], // Raw products data for charting
        rawDeliveryPartners: [] // Raw delivery partners data
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                // We use Promise.allSettled to not fail entirely if one endpoint errors
                const [ordersRes, productsRes, deliveryRes] = await Promise.allSettled([
                    BaseUrl.get('/get-all-order'),
                    BaseUrl.get('/get-product'),
                    BaseUrl.get('/getAll-delivery-man')
                ]);

                let totalOrders = 0;
                let totalRevenue = 0;
                let totalProducts = 0;
                let totalDeliveryPartners = 0;
                let pendingOrders = 0;
                let deliveredOrders = 0;
                let cancelledOrders = 0;
                let rawOrders = [];
                let rawProducts = [];
                let rawDeliveryPartners = [];

                if (ordersRes.status === 'fulfilled' && ordersRes.value.data?.orders) {
                    const orders = ordersRes.value.data.orders;
                    rawOrders = orders;
                    totalOrders = orders.length;
                    totalRevenue = orders.reduce((acc, curr) => {
                        const rev = Number(curr?.subtotal !== undefined ? curr.subtotal : (curr?.subTotal !== undefined ? curr.subTotal : curr?.total)) || 0;
                        return acc + rev;
                    }, 0);

                    pendingOrders = orders.filter(o => ['pending', 'placed', 'confirmed', 'assigned', 'packed', 'shipped', 'out_for_delivery'].includes(o?.orderStatus?.toLowerCase())).length;
                    deliveredOrders = orders.filter(o => o?.orderStatus?.toLowerCase() === 'delivered').length;
                    cancelledOrders = orders.filter(o => ['cancelled', 'returned'].includes(o?.orderStatus?.toLowerCase())).length;
                }

                if (productsRes.status === 'fulfilled' && productsRes.value.data?.list) {
                    const products = productsRes.value.data.list;
                    rawProducts = products;
                    totalProducts = products.length;
                }

                if (deliveryRes.status === 'fulfilled' && deliveryRes.value.data?.list) {
                    const partners = deliveryRes.value.data.list;
                    rawDeliveryPartners = partners;
                    totalDeliveryPartners = partners.length;
                }

                setStats({
                    totalOrders,
                    totalRevenue,
                    totalProducts,
                    totalDeliveryPartners,
                    pendingOrders,
                    deliveredOrders,
                    cancelledOrders,
                    rawOrders,
                    rawProducts,
                    rawDeliveryPartners
                });
            } catch (error) {
                console.error("Failed to fetch dashboard analytics", error);
                setError("Unable to load analytics data. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <Box>
            <PageHeader
                title="Dashboard Overview"
                breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Analytics' }]}
            />

            {error ? (
                <Alert
                    severity="error"
                    variant="outlined"
                    sx={{ mt: 3, borderRadius: 2, alignItems: 'center' }}
                    action={
                        <Button color="inherit" size="small" onClick={() => window.location.reload()} startIcon={<ReplayIcon />}>
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            ) : loading ? (
                <Box sx={{ mt: 3 }}>
                    <DashboardSkeleton />
                </Box>
            ) : (
                <Grid container spacing={3} sx={{ mt: 0 }}>
                    {/* Core Metric Cards */}
                    <Grid item xs={12} sm={6} md={3}>
                        <MetricCard
                            title="Total Revenue"
                            value={`$${stats.totalRevenue.toLocaleString()}`}
                            icon={<AttachMoneyIcon />}
                            color="success"
                            tooltip="Sum of all order subtotals"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <MetricCard
                            title="Total Orders"
                            value={stats.totalOrders}
                            icon={<ShoppingBagIcon />}
                            color="primary"
                            tooltip="All time orders placed"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <MetricCard
                            title="Pending Orders"
                            value={stats.pendingOrders}
                            icon={<PendingActionsIcon />}
                            color="warning"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <MetricCard
                            title="Delivered Orders"
                            value={stats.deliveredOrders}
                            icon={<CheckCircleOutlinedIcon />}
                            color="success"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <MetricCard
                            title="Cancelled Orders"
                            value={stats.cancelledOrders}
                            icon={<CancelOutlinedIcon />}
                            color="error"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <MetricCard
                            title="Products"
                            value={stats.totalProducts}
                            icon={<Inventory2Icon />}
                            color="info"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <MetricCard
                            title="Delivery Fleet"
                            value={stats.totalDeliveryPartners}
                            icon={<LocalShippingIcon />}
                            color="secondary"
                        />
                    </Grid>

                    {/* Left Column for Future Charts */}
                    {/* Main Analytics Row */}
                    <Grid item xs={12} lg={8}>
                        <AnalyticsCard
                            title="Sales & Revenue Trends"
                            subheader="Overview of your orders and revenue over time"
                            headerActionMenu={[
                                { label: 'View Full Report', onClick: () => { } },
                                { label: 'Export as CSV', onClick: () => { } }
                            ]}
                        >
                            <SalesChart orders={stats.rawOrders} />
                        </AnalyticsCard>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        <AnalyticsCard
                            title="Order Status Distribution"
                            subheader="Current breakdown of all orders"
                        >
                            <OrderStatusChart orders={stats.rawOrders} />
                        </AnalyticsCard>
                    </Grid>

                    {/* Business Analytics Row */}
                    <Grid item xs={12} lg={8}>
                        <AnalyticsCard
                            title="Product Distribution by Category"
                            subheader="Inventory breakdown across categories & types"
                        >
                            <CategoryChart products={stats.rawProducts} />
                        </AnalyticsCard>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        <AnalyticsCard
                            title="Payment Analytics"
                            subheader="Distribution of payment methods"
                        >
                            <PaymentChart orders={stats.rawOrders} />
                        </AnalyticsCard>
                    </Grid>

                    {/* Product & Health Analytics Row */}
                    <Grid item xs={12} lg={8}>
                        <AnalyticsCard
                            title="Top Selling Products"
                            subheader="Best performing products by revenue"
                            noPadding
                        >
                            <TopProducts orders={stats.rawOrders} products={stats.rawProducts} />
                        </AnalyticsCard>
                    </Grid>

                    <Grid item xs={12} lg={4}>
                        <AnalyticsCard
                            title="Business Health"
                            subheader="Key completion metrics"
                        >
                            <ProgressWidgets orders={stats.rawOrders} products={stats.rawProducts} />
                        </AnalyticsCard>
                    </Grid>

                    {/* Full Row for Delivery Analytics */}
                    <Grid item xs={12}>
                        <AnalyticsCard
                            title="Logistics & Delivery Fleet Analytics"
                            subheader="Real-time delivery performance and agent workload"
                        >
                            <DeliveryAnalytics orders={stats.rawOrders} deliveryPartners={stats.rawDeliveryPartners} />
                        </AnalyticsCard>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}
