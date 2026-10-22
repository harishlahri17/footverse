import React, { useEffect, useState } from 'react';
import { BaseUrl } from '../../axiosInstance';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Button,
    IconButton,
    Avatar,
    InputAdornment,
    Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PageHeader from '../component/mui/PageHeader';
import SectionCard from '../component/mui/SectionCard';

export default function ProductsTable() {
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

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        try {
            const { data } = await BaseUrl.delete(`/delete-product/${id}`);
            if (data.Success) {
                toast.success("Product deleted successfully");
                getProducts();
            }
        } catch (error) {
            console.log(error);
            toast.error("Delete failed");
        }
    };

    return (
        <Box>
            <PageHeader
                title="Product List"
                breadcrumbs={[
                    { label: 'Home', path: '/' },
                    { label: 'Products', path: '/products-table' },
                    { label: 'List' }
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
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProducts.map((item) => {
                                const mainImage = item.productImage?.find(img => img.tag === "main") || item.productImage?.[0];
                                return (
                                    <TableRow key={item._id} hover>
                                        <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                                            {item.productId}
                                        </TableCell>
                                        <TableCell>
                                            <Avatar
                                                variant="rounded"
                                                src={mainImage?.url || ""}
                                                alt={item.productName}
                                                sx={{
                                                    width: 50,
                                                    height: 50,
                                                    transition: 'transform 0.2s ease',
                                                    '&:hover': { transform: 'scale(1.5)', zIndex: 1, position: 'relative' }
                                                }}
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
                                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                                <Tooltip title="View">
                                                    <IconButton size="small" color="info" component={Link} to="#">
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Edit">
                                                    <IconButton size="small" color="warning" component={Link} to={`/edit-product/${item._id}`}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <IconButton size="small" color="error" onClick={() => handleDelete(item._id)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {filteredProducts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
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
