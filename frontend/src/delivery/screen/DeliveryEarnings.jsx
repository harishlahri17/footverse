import React, { useEffect, useState } from 'react';
import { BaseUrl } from '../../axiosInstance';
import { toast } from "react-toastify";
import DeliveryLayout from '../layout/DeliveryLayout';
import { 
    Box, Grid, Card, CardContent, Typography, Avatar, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    TextField, InputAdornment, Chip, Skeleton, Select, MenuItem, TablePagination, Stack, Alert
} from '@mui/material';
import { 
    SearchRounded, FilterAltRounded, AccountBalanceWalletRounded, 
    TrendingUpRounded, CalendarTodayRounded, ReceiptLongRounded 
} from '@mui/icons-material';

export default function DeliveryEarnings() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [search, setSearch] = useState("");
    const [timeFilter, setTimeFilter] = useState("all"); 
    
    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [stats, setStats] = useState({
        todayEarnings: 0,
        weekEarnings: 0,
        monthEarnings: 0,
        totalEarnings: 0
    });

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await BaseUrl.get("/get-assigned-order");
            if (data.Success) {
                const allOrders = data.orders || [];
                // Earnings only come from delivered orders in the existing logic
                const deliveredOrders = allOrders.filter(o => o.orderStatus === 'delivered');
                setOrders(deliveredOrders);
                calculateEarnings(deliveredOrders);
            } else {
                setError("Failed to load earnings data");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError("Error connecting to server to fetch data.");
            toast.error("Failed to load earnings.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // eslint-disable-next-line
    }, []);

    const calculateEarnings = (deliveredOrders) => {
        const COMMISSION_PER_ORDER = 30; // Existing logic from Dashboard
        const now = new Date();
        const todayStr = now.toISOString().split("T")[0];
        
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday as start
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let today = 0, week = 0, month = 0, total = 0;

        deliveredOrders.forEach(o => {
            const orderDate = new Date(o.updatedAt || o.createdAt);
            const dateStr = orderDate.toISOString().split("T")[0];
            const earnings = COMMISSION_PER_ORDER;

            total += earnings;

            if (dateStr === todayStr) today += earnings;
            if (orderDate >= startOfWeek) week += earnings;
            if (orderDate >= startOfMonth) month += earnings;
        });

        setStats({ todayEarnings: today, weekEarnings: week, monthEarnings: month, totalEarnings: total });
    };

    // Derived filtered orders
    const getFilteredOrders = () => {
        let temp = [...orders];

        if (search) {
            const lower = search.toLowerCase();
            temp = temp.filter(o => 
                o._id.toLowerCase().includes(lower) ||
                o.address?.city?.toLowerCase().includes(lower)
            );
        }

        if (timeFilter !== "all") {
            const now = new Date();
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            
            temp = temp.filter(o => {
                const date = new Date(o.updatedAt || o.createdAt);
                if (timeFilter === "today") return date.toISOString().split("T")[0] === now.toISOString().split("T")[0];
                if (timeFilter === "week") return date >= startOfWeek;
                if (timeFilter === "month") return date >= startOfMonth;
                return true;
            });
        }

        // Sort by newest first
        return temp.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    };

    const filteredOrders = getFilteredOrders();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <DeliveryLayout>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="800" gutterBottom>
                    Earnings
                </Typography>
                <Typography color="text.secondary">
                    Track your delivery earnings and performance
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
            )}

            {/* Top Summary Cards */}
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'info.light', color: 'info.main', width: 52, height: 52 }}>
                                <CalendarTodayRounded />
                            </Avatar>
                            <Box>
                                <Typography color="text.secondary" variant="caption" fontWeight="600" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Today's Earnings</Typography>
                                <Typography variant="h4" fontWeight="800" sx={{ lineHeight: 1.2, my: 0.25 }}>
                                    {loading ? <Skeleton width={60} /> : `₹${stats.todayEarnings}`}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main', width: 52, height: 52 }}>
                                <TrendingUpRounded />
                            </Avatar>
                            <Box>
                                <Typography color="text.secondary" variant="caption" fontWeight="600" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>This Week</Typography>
                                <Typography variant="h4" fontWeight="800" sx={{ lineHeight: 1.2, my: 0.25 }}>
                                    {loading ? <Skeleton width={60} /> : `₹${stats.weekEarnings}`}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', width: 52, height: 52 }}>
                                <ReceiptLongRounded />
                            </Avatar>
                            <Box>
                                <Typography color="text.secondary" variant="caption" fontWeight="600" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>This Month</Typography>
                                <Typography variant="h4" fontWeight="800" sx={{ lineHeight: 1.2, my: 0.25 }}>
                                    {loading ? <Skeleton width={60} /> : `₹${stats.monthEarnings}`}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'success.light', color: 'success.main', width: 52, height: 52 }}>
                                <AccountBalanceWalletRounded />
                            </Avatar>
                            <Box>
                                <Typography color="text.secondary" variant="caption" fontWeight="600" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Earnings</Typography>
                                <Typography variant="h4" fontWeight="800" sx={{ lineHeight: 1.2, my: 0.25 }}>
                                    {loading ? <Skeleton width={60} /> : `₹${stats.totalEarnings}`}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Earnings Chart Container (Placeholder as requested to use existing logic without fake data) */}
            <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'none' }}>
                {/* 
                  Hidden as per instructions: "If no chart exists: Do NOT create fake business data."
                  This container is ready to accept a Recharts or Chart.js component if data becomes available.
                */}
            </Card>

            {/* Transaction / Earnings Table */}
            <Card>
                <Box sx={{ p: { xs: 1.5, sm: 2 }, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                    <Typography variant="h6" fontWeight="700" sx={{ flex: '1 1 auto' }}>Earning History</Typography>
                    
                    <TextField
                        size="small"
                        placeholder="Search Order ID or City..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                        sx={{ flex: { xs: '1 1 100%', sm: '0 1 220px' }, minWidth: 0 }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchRounded fontSize="small" /></InputAdornment>,
                        }}
                    />
                    
                    <Select
                        size="small"
                        value={timeFilter}
                        onChange={(e) => { setTimeFilter(e.target.value); setPage(0); }}
                        displayEmpty
                        sx={{ flex: { xs: '1 1 100%', sm: '0 0 150px' }, minWidth: 0 }}
                        startAdornment={
                            <InputAdornment position="start"><FilterAltRounded fontSize="small" /></InputAdornment>
                        }
                    >
                        <MenuItem value="all">All Time</MenuItem>
                        <MenuItem value="today">Today</MenuItem>
                        <MenuItem value="week">This Week</MenuItem>
                        <MenuItem value="month">This Month</MenuItem>
                    </Select>
                </Box>

                <TableContainer sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <Table sx={{ minWidth: 600 }}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'background.default' }}>
                                <TableCell>Date</TableCell>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Delivery Area</TableCell>
                                <TableCell>Total Amount</TableCell>
                                <TableCell>Commission</TableCell>
                                <TableCell align="right">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                Array.from(new Array(5)).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell><Skeleton width="80%" /></TableCell>
                                        <TableCell><Skeleton width="60%" /></TableCell>
                                        <TableCell><Skeleton width="70%" /></TableCell>
                                        <TableCell><Skeleton width="50%" /></TableCell>
                                        <TableCell><Skeleton width="50%" /></TableCell>
                                        <TableCell align="right"><Skeleton variant="rounded" width={80} height={24} sx={{ ml: 'auto' }} /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredOrders.length > 0 ? (
                                filteredOrders
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((order) => (
                                    <TableRow key={order._id} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="600">
                                                {new Date(order.updatedAt || order.createdAt).toLocaleDateString('en-GB')}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(order.updatedAt || order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                                            #{order._id.substring(order._id.length - 8).toUpperCase()}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" noWrap>
                                                {order.address?.area || "N/A"}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                {order.address?.city}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary">
                                                ₹{order.total}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body1" fontWeight="700" color="success.main">
                                                + ₹30
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Chip 
                                                label="Credited" 
                                                color="success" 
                                                size="small" 
                                                variant="filled"
                                                icon={<CheckCircleRounded />}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <AccountBalanceWalletRounded sx={{ fontSize: 64, color: 'text.disabled', opacity: 0.5, mb: 2 }} />
                                            <Typography variant="h6" color="text.primary">No Earnings Found</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                You haven't completed any deliveries for this filter yet.
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {!loading && filteredOrders.length > 0 && (
                    <TablePagination
                        component="div"
                        count={filteredOrders.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                        sx={{ borderTop: 1, borderColor: 'divider' }}
                    />
                )}
            </Card>
        </DeliveryLayout>
    );
}
