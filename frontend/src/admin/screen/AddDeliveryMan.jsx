import React, { useState } from 'react';
import { BaseUrl } from '../../axiosInstance';
import { toast } from 'react-toastify';
import { useAuth } from '../../store/auth';
import { 
    Box, Grid, TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel,
    Chip, Divider, InputAdornment, IconButton, Paper
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PageHeader from '../component/mui/PageHeader';
import SectionCard from '../component/mui/SectionCard';

export default function AddDeliveryMan() {
    const { token } = useAuth();

    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
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
        setErrors({ ...errors, [name]: "" }); 
    };

    // assign area input 
    const [areaInput, setAreaInput] = useState("");
    const [assignArea, setAssignArea] = useState([]);

    const handleAddArea = () => {
        if (!areaInput.trim()) return;
        setAssignArea([...assignArea, areaInput.trim()]);
        setAreaInput(""); 
        setErrors(prev => ({ ...prev, assignedAreas: "" }));
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
        setErrors(prev => ({ ...prev, assignedPincodes: "" }));
    };

    const handleRemovePincode = (index) => {
        const updated = [...assignPincode];
        updated.splice(index, 1);
        setAssignPincode(updated);
    };

    const validate = () => {
        let newErrors = {};

        if (!formData.fullName) newErrors.fullName = "Full Name is required";
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid Email format";
        }
        if (!formData.phone) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
            newErrors.phone = "Enter a valid 10-digit mobile number.";
        }
        if (!formData.password) newErrors.password = "Password is required";
        
        if (!formData.vehicleType) newErrors.vehicleType = "Vehicle type is required.";
        if (!formData.vehicleNumber) newErrors.vehicleNumber = "Vehicle number is required.";
        if (!formData.model) newErrors.model = "Vehicle model is required.";
        if (!formData.licenseNumber) newErrors.licenseNumber = "License number is required.";
        
        if (!formData.salary) newErrors.salary = "Salary is required.";
        if (!formData.commissionPerOrder) newErrors.commissionPerOrder = "Commission is required.";
        
        if (!formData.assignedCity) newErrors.assignedCity = "Assigned city is required.";
        
        if (assignArea.length === 0) {
            newErrors.assignedAreas = "Please add at least one area.";
        }
        if (assignPincode.length === 0) {
            newErrors.assignedPincodes = "Please add at least one pincode.";
        } else {
            const invalid = assignPincode.some(pin => !/^\d{6}$/.test(pin));
            if (invalid) {
                newErrors.assignedPincodes = "Each pincode must be a valid 6-digit number.";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            const payload = {
                ...formData,
                assignedAreas: assignArea,
                assignedPincodes: assignPincode
            };

            const { data } = await BaseUrl.post("/add-delivery-man", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data?.Success) {
                toast.success(data?.Message);
                setFormData({
                    fullName: "", email: "", phone: "", password: "",
                    vehicleType: "", vehicleNumber: "", model: "", licenseNumber: "",
                    salary: "", commissionPerOrder: "", assignedCity: ""
                });
                setAssignArea([]);
                setAssignPincode([]);
                setAreaInput("");
                setPinInput("");
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong!");
        }
    };

    
    return (
        <Box sx={{ pb: 4 }}>
            <PageHeader 
                title="Add Delivery Man" 
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Delivery Men', path: '/delivery-man' },
                    { label: 'Add Delivery Man' }
                ]} 
            />

            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, maxWidth: '1000px', mx: 'auto' }}>
                    
                    {/* Card 1: Personal Information */}
                    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3 }}>
                            <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: 'rgba(94, 72, 232, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5E48E8' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.05rem' }}>
                                Personal Information
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>Full Name <Box component="span" sx={{ color: '#EF4444' }}>*</Box></Typography>
                                <TextField fullWidth size="small" name="fullName" value={formData.fullName} onChange={handleFormChange} placeholder="John Doe" error={!!errors.fullName} helperText={errors.fullName} required />
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>Email Address <Box component="span" sx={{ color: '#EF4444' }}>*</Box></Typography>
                                <TextField fullWidth size="small" type="email" name="email" value={formData.email} onChange={handleFormChange} placeholder="john@example.com" error={!!errors.email} helperText={errors.email} required />
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>Phone Number <Box component="span" sx={{ color: '#EF4444' }}>*</Box></Typography>
                                <TextField fullWidth size="small" name="phone" value={formData.phone} onChange={handleFormChange} placeholder="9876543210" error={!!errors.phone} helperText={errors.phone} required />
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>Password <Box component="span" sx={{ color: '#EF4444' }}>*</Box></Typography>
                                <TextField fullWidth size="small" type="text" name="password" value={formData.password} onChange={handleFormChange} placeholder="Enter temporary password" error={!!errors.password} helperText={errors.password} required />
                            </Box>
                        </Box>
                    </Paper>

                    {/* Card 2: Vehicle Information */}
                    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3 }}>
                            <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: 'rgba(94, 72, 232, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5E48E8' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                            </Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.05rem' }}>
                                Vehicle Information
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>Vehicle Type <Box component="span" sx={{ color: '#EF4444' }}>*</Box></Typography>
                                <FormControl fullWidth size="small" error={!!errors.vehicleType}>
                                    <Select name="vehicleType" value={formData.vehicleType} onChange={handleFormChange} displayEmpty>
                                        <MenuItem value="" disabled>Select Vehicle Type</MenuItem>
                                        <MenuItem value="Bike"><Typography variant="body2" sx={{ fontWeight: 600 }}>Bike</Typography></MenuItem>
                                        <MenuItem value="Scooter"><Typography variant="body2" sx={{ fontWeight: 600 }}>Scooter</Typography></MenuItem>
                                        <MenuItem value="Bicycle"><Typography variant="body2" sx={{ fontWeight: 600 }}>Bicycle</Typography></MenuItem>
                                        <MenuItem value="EV"><Typography variant="body2" sx={{ fontWeight: 600 }}>EV</Typography></MenuItem>
                                        <MenuItem value="Other"><Typography variant="body2" sx={{ fontWeight: 600 }}>Other</Typography></MenuItem>
                                    </Select>
                                    {errors.vehicleType && <Typography variant="caption" color="error">{errors.vehicleType}</Typography>}
                                </FormControl>
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>Vehicle Number <Box component="span" sx={{ color: '#EF4444' }}>*</Box></Typography>
                                <TextField fullWidth size="small" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleFormChange} placeholder="CG-04-AB-1234" error={!!errors.vehicleNumber} helperText={errors.vehicleNumber} required />
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>Vehicle Model <Box component="span" sx={{ color: '#EF4444' }}>*</Box></Typography>
                                <TextField fullWidth size="small" name="model" value={formData.model} onChange={handleFormChange} placeholder="Hero Splendor" error={!!errors.model} helperText={errors.model} required />
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>License Number <Box component="span" sx={{ color: '#EF4444' }}>*</Box></Typography>
                                <TextField fullWidth size="small" name="licenseNumber" value={formData.licenseNumber} onChange={handleFormChange} placeholder="Driving License No." error={!!errors.licenseNumber} helperText={errors.licenseNumber} required />
                            </Box>
                        </Box>
                    </Paper>

                    {/* Card 3: Financial Information */}
                    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3 }}>
                            <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: 'rgba(94, 72, 232, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5E48E8' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            </Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.05rem' }}>
                                Financial Information
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>Monthly Salary (₹) <Box component="span" sx={{ color: '#EF4444' }}>*</Box></Typography>
                                <TextField fullWidth size="small" type="number" name="salary" value={formData.salary} onChange={handleFormChange} placeholder="15000" error={!!errors.salary} helperText={errors.salary} required InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.95rem' }}>₹</Typography></InputAdornment> }} />
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>Commission per Order (₹) <Box component="span" sx={{ color: '#EF4444' }}>*</Box></Typography>
                                <TextField fullWidth size="small" type="number" name="commissionPerOrder" value={formData.commissionPerOrder} onChange={handleFormChange} placeholder="30" error={!!errors.commissionPerOrder} helperText={errors.commissionPerOrder} required InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.95rem' }}>₹</Typography></InputAdornment> }} />
                            </Box>
                        </Box>
                    </Paper>

                    {/* Card 4: Location / Area Assignment */}
                    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3 }}>
                            <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: 'rgba(94, 72, 232, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5E48E8' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.05rem' }}>
                                Location & Area Assignment
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
                            <Box sx={{ gridColumn: { xs: '1 / -1', md: '1 / -1' } }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>Assigned City <Box component="span" sx={{ color: '#EF4444' }}>*</Box></Typography>
                                <TextField fullWidth size="small" name="assignedCity" value={formData.assignedCity} onChange={handleFormChange} placeholder="e.g. Raipur" error={!!errors.assignedCity} helperText={errors.assignedCity} required />
                            </Box>

                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>Assign Areas <Box component="span" sx={{ color: '#EF4444' }}>*</Box></Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField fullWidth size="small" value={areaInput} onChange={(e) => setAreaInput(e.target.value)} placeholder="Enter Area Name" 
                                        onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddArea(); } }}
                                    />
                                    <Button variant="contained" onClick={handleAddArea} disabled={!areaInput.trim()} sx={{ bgcolor: '#5E48E8', color: '#FFFFFF', fontWeight: 700, px: 3, borderRadius: 2, '&:hover': { bgcolor: '#4834D4' } }}>
                                        Add
                                    </Button>
                                </Box>
                                {errors.assignedAreas && <Typography variant="caption" color="error">{errors.assignedAreas}</Typography>}
                                {assignArea.length > 0 && (
                                    <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {assignArea.map((area, index) => (
                                            <Chip key={index} label={area} onDelete={() => handleRemoveArea(index)} 
                                                sx={{ bgcolor: 'rgba(79, 70, 229, 0.1)', color: (t) => t.palette.mode === 'dark' ? '#818CF8' : '#4F46E5', fontWeight: 700, '& .MuiChip-deleteIcon': { color: (t) => t.palette.mode === 'dark' ? '#818CF8' : '#4F46E5', '&:hover': { color: (t) => t.palette.mode === 'dark' ? '#A5B4FC' : '#3730A3' } } }} 
                                            />
                                        ))}
                                    </Box>
                                )}
                            </Box>

                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>Assign Pincodes <Box component="span" sx={{ color: '#EF4444' }}>*</Box></Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField fullWidth size="small" value={pinInput} onChange={(e) => setPinInput(e.target.value)} placeholder="Enter Pincode" 
                                        onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddPincode(); } }}
                                    />
                                    <Button variant="contained" onClick={handleAddPincode} disabled={!pinInput.trim()} sx={{ bgcolor: '#5E48E8', color: '#FFFFFF', fontWeight: 700, px: 3, borderRadius: 2, '&:hover': { bgcolor: '#4834D4' } }}>
                                        Add
                                    </Button>
                                </Box>
                                {errors.assignedPincodes && <Typography variant="caption" color="error">{errors.assignedPincodes}</Typography>}
                                {assignPincode.length > 0 && (
                                    <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {assignPincode.map((pin, index) => (
                                            <Chip key={index} label={pin} onDelete={() => handleRemovePincode(index)} 
                                                sx={{ bgcolor: 'rgba(219, 39, 119, 0.1)', color: (t) => t.palette.mode === 'dark' ? '#F472B6' : '#DB2777', fontWeight: 700, '& .MuiChip-deleteIcon': { color: (t) => t.palette.mode === 'dark' ? '#F472B6' : '#DB2777', '&:hover': { color: (t) => t.palette.mode === 'dark' ? '#F9A8D4' : '#BE185D' } } }} 
                                            />
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Paper>

                    {/* Submit Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
                        <Button variant="outlined" onClick={() => {
                            setFormData({
                                fullName: "", email: "", phone: "", password: "",
                                vehicleType: "", vehicleNumber: "", model: "", licenseNumber: "",
                                salary: "", commissionPerOrder: "", assignedCity: ""
                            });
                            setAssignArea([]); setAssignPincode([]); setAreaInput(""); setPinInput(""); setErrors({});
                        }} sx={{ borderColor: 'divider', color: 'text.primary', bgcolor: 'background.paper', px: 3, py: 1, borderRadius: 2, fontWeight: 700, fontSize: '0.9rem', '&:hover': { borderColor: 'divider', bgcolor: 'background.default' } }}>
                            Reset
                        </Button>
                        <Button type="submit" variant="contained" sx={{ bgcolor: '#5E48E8', color: '#FFFFFF', px: 4, py: 1, borderRadius: 2, fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 14px rgba(94, 72, 232, 0.3)', '&:hover': { bgcolor: '#4834D4' } }}>
                            Submit Application
                        </Button>
                    </Box>

                </Box>
            </form>
        </Box>
    );

}
