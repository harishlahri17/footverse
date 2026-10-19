import React, { useEffect, useState } from 'react';
import { BaseUrl } from '../../axiosInstance';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    TextField, Button, Avatar, InputAdornment, Chip 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PageHeader from '../component/mui/PageHeader';
import SectionCard from '../component/mui/SectionCard';

export default function FeaturedProduct() {
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

    const addFeatured = async (id) => {
        try {
            const { data } = await BaseUrl.post(`/featured-product/${id}`);
            if (data.Success) {
                toast.success(data.Message);
                getProducts();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const removeFeatured = async (id) => {
        try {
            const { data } = await BaseUrl.put(`/remove-featured-product/${id}`);
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
            <PageHeader 
                title="Featured Products" 
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Products', path: '/products-table' },
                    { label: 'Featured Products' }
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
                                            {item.isFeatured ? (
                                                <Chip label="Featured" color="success" size="small" icon={<StarIcon fontSize="small"/>} sx={{ fontWeight: 600 }} />
                                            ) : (
                                                <Chip label="Normal" color="default" size="small" sx={{ fontWeight: 600 }} />
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {item.isFeatured ? (
                                                <Button size="small" color="error" variant="outlined" onClick={() => removeFeatured(item._id)}>
                                                    Remove
                                                </Button>
                                            ) : (
                                                <Button size="small" color="info" variant="contained" startIcon={<StarBorderIcon />} onClick={() => addFeatured(item._id)}>
                                                    Add
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {filteredProducts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={11} align="center" sx={{ py: 3 }}>
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
