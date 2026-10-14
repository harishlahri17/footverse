import React, { useEffect, useState } from 'react';
import { BaseUrl } from '../../axiosInstance';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Grid, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel,
    Chip, Divider, IconButton, CircularProgress
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PageHeader from '../component/mui/PageHeader';
import SectionCard from '../component/mui/SectionCard';

export default function EditDeliveryMan() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        vehicleType: "",
        vehicleNumber: "",
        model: "",
        licenseNumber: "",
        salary: "",
        commissionPerOrder: "",
        assignedCity: "",
    });
    
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // assign area input 
    const [areaInput, setAreaInput] = useState("");
    const [assignArea, setAssignArea] = useState([]);

    const handleAddArea = () => {
        if (!areaInput.trim()) return;
        setAssignArea([...assignArea, areaInput.trim()]);
        setAreaInput(""); 
    };

    const handleRemoveArea = (index) => {
        const updated = [...assignArea];
        updated.splice(index, 1);
        setAssignArea(updated);
    };

    // asssign pincode input
    const [pinInput, setPinInput] = useState("");
    const [assignPincode, setAssignPincode] = useState([]);

    const handleAddPincode = () => {
        if (!pinInput.trim()) return;
        setAssignPincode([...assignPincode, pinInput.trim()]);
        setPinInput("");
    };

    const handleRemovePincode = (index) => {
        const updated = [...assignPincode];
        updated.splice(index, 1);
        setAssignPincode(updated);
    };

    const getDeliveryMan = async () => {
        try {
            const { data } = await BaseUrl.get(`/get-signle-delivery-man/${id}`);
            const man = data.deliveryMan;
            setFormData({
                fullName: man.userId?.fullName || "",
                email: man.userId?.email || "",
                phone: man.userId?.phone || "",
                vehicleType: man.vehicleDetails?.vehicleType || "",
                vehicleNumber: man.vehicleDetails?.vehicleNumber || "",
                model: man.vehicleDetails?.model || "",
                licenseNumber: man.licenseNumber || "",
                salary: man.salary || "",
                commissionPerOrder: man.commissionPerOrder || "",
                assignedCity: man.assignedCity || ""
            });
            setAssignArea(man.assignedAreas || []);
            setAssignPincode(man.assignedPincodes || []);
        } catch (error) {
            toast.error("Unable to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDeliveryMan();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                assignedAreas: assignArea,
                assignedPincodes: assignPincode
            };
            const { data } = await BaseUrl.put(`/update-single-delivery-man/${id}`, payload);
            if (data.Success) {
                toast.success(data.Message);
                navigate("/delivery-man");
            }
        } catch (error) {
            toast.error(error.response?.data?.Message || "Something went wrong");
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <PageHeader 
                title="Edit Delivery Man" 
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Delivery Men', path: '/delivery-man' },
                    { label: 'Edit' }
                ]} 
            />

            <SectionCard title="Edit Delivery Man Profile">
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    {/* Personal Information */}
                    <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 1, fontWeight: 'bold' }}>
                        Personal Information
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="email"
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleFormChange}
                                disabled
                                helperText="Email cannot be changed"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleFormChange}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 3 }} />

                    {/* Vehicle Information */}
                    <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Vehicle Information
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel id="vehicle-type-label">Vehicle Type</InputLabel>
                                <Select
                                    labelId="vehicle-type-label"
                                    name="vehicleType"
                                    value={formData.vehicleType}
                                    onChange={handleFormChange}
                                    label="Vehicle Type"
                                >
                                    <MenuItem value="Bike">Bike</MenuItem>
                                    <MenuItem value="Scooter">Scooter</MenuItem>
                                    <MenuItem value="Bicycle">Bicycle</MenuItem>
                                    <MenuItem value="EV">EV</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="Vehicle Number"
                                name="vehicleNumber"
                                value={formData.vehicleNumber}
                                onChange={handleFormChange}
                                placeholder="e.g. CG-04-AB-1234"
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="Model"
                                name="model"
                                value={formData.model}
                                onChange={handleFormChange}
                                placeholder="e.g. Hero Splendor"
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="License Number"
                                name="licenseNumber"
                                value={formData.licenseNumber}
                                onChange={handleFormChange}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 3 }} />

                    {/* Financial Information */}
                    <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Financial Information
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Monthly Salary (₹)"
                                name="salary"
                                value={formData.salary}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Commission per Order (₹)"
                                name="commissionPerOrder"
                                value={formData.commissionPerOrder}
                                onChange={handleFormChange}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 3 }} />

                    {/* Location / Area Assignment */}
                    <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Location / Area Assignment
                    </Typography>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Assigned City"
                                name="assignedCity"
                                value={formData.assignedCity}
                                onChange={handleFormChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <TextField
                                    fullWidth
                                    label="Assign Areas"
                                    value={areaInput}
                                    onChange={(e) => setAreaInput(e.target.value)}
                                    placeholder="Enter Area Name"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddArea();
                                        }
                                    }}
                                />
                                <IconButton color="primary" onClick={handleAddArea} size="large">
                                    <AddCircleIcon fontSize="large" />
                                </IconButton>
                            </Box>
                            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {assignArea.map((area, index) => (
                                    <Chip 
                                        key={index} 
                                        label={area} 
                                        onDelete={() => handleRemoveArea(index)} 
                                        color="info" 
                                        variant="outlined" 
                                    />
                                ))}
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <TextField
                                    fullWidth
                                    label="Assign Pincodes"
                                    value={pinInput}
                                    onChange={(e) => setPinInput(e.target.value)}
                                    placeholder="Enter Pincode"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddPincode();
                                        }
                                    }}
                                />
                                <IconButton color="primary" onClick={handleAddPincode} size="large">
                                    <AddCircleIcon fontSize="large" />
                                </IconButton>
                            </Box>
                            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {assignPincode.map((pin, index) => (
                                    <Chip 
                                        key={index} 
                                        label={pin} 
                                        onDelete={() => handleRemovePincode(index)} 
                                        color="secondary" 
                                        variant="outlined" 
                                    />
                                ))}
                            </Box>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-start', gap: 2 }}>
                        <Button 
                            type="button" 
                            variant="outlined" 
                            color="inherit" 
                            size="large"
                            onClick={() => navigate('/delivery-man')}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            size="large"
                            sx={{ minWidth: 200 }}
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Box>
            </SectionCard>
        </Box>
    );
}
