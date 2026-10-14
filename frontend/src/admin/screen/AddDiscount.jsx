import React, { useEffect, useState } from 'react';
import { BaseUrl } from '../../axiosInstance';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    TextField, Button, Avatar, InputAdornment, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PageHeader from '../component/mui/PageHeader';
import SectionCard from '../component/mui/SectionCard';

export default function AddDiscount() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    
    const getProducts = async () => {
        try {
            const { data } = await BaseUrl.get("/get-product");
            setProducts(data?.list || []);
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(() => {
        getProducts();
    }, []);

    const [search, setSearch] = useState("");
    
    const filteredProducts = products.filter((item) => {
        const searchText = search.toLowerCase();
        return (
            item.productId?.toLowerCase().includes(searchText) ||
            item.category?.toLowerCase().includes(searchText) ||
            item.type?.toLowerCase().includes(searchText)
        );
    });

    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState("");
    const [discountType, setDiscountType] = useState("percentage");
    const [discountValue, setDiscountValue] = useState("");

    const openDiscountBox = (id) => {
        setSelectedId(id);
        setShowModal(true);
    };

    const saveDiscount = async (e) => {
        e.preventDefault();
        try {
            const { data } = await BaseUrl.put(`/add-discount/${selectedId}`, {
                type: discountType,
                value: Number(discountValue)
            });
            if (data.Success) {
                toast.success(data.Message);
                setShowModal(false);
                setDiscountValue("");
                getProducts();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const removeDiscount = async (id) => {
        try {
            const { data } = await BaseUrl.put(`/remove-discount/${id}`);
            if (data.Success) {
                toast.success(data.Message);
                getProducts();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Box>
            <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="xs" fullWidth>
                <form onSubmit={saveDiscount}>
                    <DialogTitle sx={{ fontWeight: 600 }}>Add Discount</DialogTitle>
                    <DialogContent dividers>
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="discount-type-label">Discount Type</InputLabel>
                            <Select
                                labelId="discount-type-label"
                                value={discountType}
                                label="Discount Type"
                                onChange={(e) => setDiscountType(e.target.value)}
                            >
                                <MenuItem value="percentage">Percentage</MenuItem>
                                <MenuItem value="amount">Rupees (Amount)</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Discount Value"
                            type="number"
                            value={discountValue}
                            onChange={(e) => setDiscountValue(e.target.value)}
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowModal(false)} color="inherit">Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">Save</Button>
                    </DialogActions>
                </form>
            </Dialog>

            <PageHeader 
                title="Manage Discounts" 
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Products', path: '/products-table' },
                    { label: 'Add Discount' }
                ]} 
            />

            <SectionCard>
                {/* Top Controls */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <TextField
                        placeholder="Search by ID, Category, Type..."
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
                        onClick={() => navigate("/add-product")}
                    >
                        Add Product
                    </Button>
                </Box>

                {/* Data Table */}
                <TableContainer>
                    <Table hover size="medium">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Brand</TableCell>
                                <TableCell>Color</TableCell>
                                <TableCell>Size</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell>Final Price</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProducts.map((item) => {
                                const mainImage = item.productImage?.find(img => img.tag === "main");
                                return (
                                    <TableRow key={item._id} hover>
                                        <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                                            {item.productId}
                                        </TableCell>
                                        <TableCell>
                                            <Avatar 
                                                variant="rounded" 
                                                src={`http://localhost:5000/media/products/${mainImage?.url}`} 
                                                alt={item.productName}
                                                sx={{ width: 50, height: 50 }}
                                            />
                                        </TableCell>
                                        <TableCell>{item.productName}</TableCell>
                                        <TableCell>{item.category}</TableCell>
                                        <TableCell>{item.type}</TableCell>
                                        <TableCell>{item.brand}</TableCell>
                                        <TableCell>{item.color}</TableCell>
                                        <TableCell>{item.size}</TableCell>
                                        <TableCell>{item.price}</TableCell>
                                        <TableCell align="center">
                                            {item.discount?.isDiscount ? (
                                                <Chip 
                                                    label={item.discount.type === "percentage" ? `${item.discount.value}% OFF` : `₹${item.discount.value} OFF`} 
                                                    color="success" 
                                                    size="small" 
                                                    sx={{ fontWeight: 600 }} 
                                                />
                                            ) : (
                                                <Chip label="No Discount" color="default" size="small" sx={{ fontWeight: 600 }} />
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: 'success.main' }}>
                                            ₹{item.discount?.finalPrice || item.price}
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.discount?.isDiscount ? (
                                                <Button size="small" color="error" variant="outlined" onClick={() => removeDiscount(item._id)}>
                                                    Remove
                                                </Button>
                                            ) : (
                                                <Button size="small" color="info" variant="contained" startIcon={<LocalOfferIcon />} onClick={() => openDiscountBox(item._id)}>
                                                    Add Discount
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {filteredProducts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={12} align="center" sx={{ py: 3 }}>
                                        No products found.
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
