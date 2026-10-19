import React, { useEffect, useState } from 'react';
import { BaseUrl } from '../../axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    TextField, Button, IconButton, Chip, Avatar, Typography, InputAdornment, Tooltip 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PageHeader from '../component/mui/PageHeader';
import SectionCard from '../component/mui/SectionCard';

export default function DeliveryMan() {
    const navigate = useNavigate();
    const [deliveryMan, setDeliveryMan] = useState([]);
    const [search, setSearch] = useState("");

    const getDeliveryMan = async () => {
        try {
            const { data } = await BaseUrl.get("/getAll-delivery-man");
            setDeliveryMan(data?.list || []);
        } catch (error) {
            console.log(error);
            toast.error(error.message || "Failed to fetch delivery men");
        }
    };

    useEffect(() => {
        getDeliveryMan();
    }, []);

    const filteredDeliveryMan = deliveryMan.filter((man) => {
        const query = search.toLowerCase();
        return (
            man.userId?.fullName?.toLowerCase().includes(query) ||
            man.userId?.phone?.toLowerCase().includes(query) ||
            man.assignedCity?.toLowerCase().includes(query)
        );
    });

    return (
        <Box>
            <PageHeader 
                title="Delivery Man Management" 
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Delivery Men' }
                ]} 
            />

            <SectionCard>
                {/* Top Controls */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <TextField
                        placeholder="Search by Name, Phone, City..."
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: { xs: '100%', sm: '300px' } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => navigate("/add-delivery-man")}
                    >
                        Add Delivery Man
                    </Button>
                </Box>

                {/* Data Table */}
                <TableContainer>
                    <Table hover size="medium">
                        <TableHead>
                            <TableRow>
                                <TableCell>Photo</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Vehicle Details</TableCell>
                                <TableCell>License Number</TableCell>
                                <TableCell>Salary / Comm.</TableCell>
                                <TableCell>City / Pincodes</TableCell>
                                <TableCell align="center">Rating</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Online</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDeliveryMan.map((man) => (
                                <TableRow key={man._id} hover>
                                    <TableCell>
                                        <Avatar 
                                            src={man.photo ? `http://localhost:5000/media/delivery/${man.photo}` : undefined} 
                                            alt={man.userId?.fullName || "User"}
                                            sx={{ width: 45, height: 45, border: '1px solid', borderColor: 'divider' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="600" color="textPrimary">
                                            {man.userId?.fullName || "Deleted User"}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary" display="block">
                                            {man.userId?.phone || "No phone"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={man.vehicleDetails?.vehicleType || "N/A"} size="small" variant="outlined" sx={{ mb: 0.5 }} />
                                        <Typography variant="caption" color="textSecondary" display="block">
                                            {man.vehicleDetails?.vehicleNumber || "N/A"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontFamily="monospace">
                                            {man.licenseNumber || "N/A"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="600">₹{man.salary}</Typography>
                                        <Typography variant="caption" color="success.main">₹{man.commissionPerOrder}/order</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{man.assignedCity || "N/A"}</Typography>
                                        <Typography variant="caption" color="textSecondary" fontFamily="monospace">
                                            {man.assignedPincodes?.join(", ") || "N/A"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                                            <Chip 
                                                icon={<StarIcon sx={{ color: '#fff !important' }} fontSize="small" />} 
                                                label={man.rating?.average || "5.0"} 
                                                size="small" 
                                                color="warning" 
                                                sx={{ fontWeight: 'bold' }} 
                                            />
                                            <Typography variant="caption" color="textSecondary">
                                                ({man.rating?.count || 0})
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip 
                                            label={man.status} 
                                            color={man.status === 'active' ? 'success' : 'error'} 
                                            size="small" 
                                            variant="outlined" 
                                            sx={{ textTransform: 'capitalize', fontWeight: 'bold' }} 
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip 
                                            label={man.isOnline ? "Online" : "Offline"} 
                                            color={man.isOnline ? "success" : "default"} 
                                            size="small" 
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box display="flex" justifyContent="center" gap={1}>
                                            <Tooltip title="Edit Profile">
                                                <IconButton size="small" color="primary" onClick={() => navigate(`/edit-delivery-man/${man._id}`)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="View Ratings">
                                                <IconButton size="small" color="warning">
                                                    <StarIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={man.status === 'active' ? 'Suspend' : 'Activate'}>
                                                <IconButton size="small" color={man.status === 'active' ? 'error' : 'success'}>
                                                    {man.status === 'active' ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton size="small" color="error">
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredDeliveryMan.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                                        No delivery men found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </SectionCard>
        </Box>
    );
}
