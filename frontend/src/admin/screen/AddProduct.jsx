import React, { useRef, useState, useMemo } from 'react';
import { BaseUrl } from '../../axiosInstance';
import { toast } from 'react-toastify';
import { 
    Box, Grid, TextField, Select, MenuItem, FormControl, InputLabel, 
    Button, IconButton, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, Paper, InputAdornment, Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PageHeader from '../component/mui/PageHeader';

import {
  LocalOfferOutlined as TagIcon,
  CheckCircle as CheckCircleIcon,
  GridView as GridIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  FormatAlignLeft as AlignLeftIcon,
  FormatAlignCenter as AlignCenterIcon,
  FormatListBulleted as BulletListIcon,
  FormatListNumbered as NumberListIcon,
  InsertLink as LinkIcon,
  InsertPhotoOutlined as ImageIcon,
  Code as CodeIcon,
  CloudUploadOutlined as UploadCloudIcon,
  Close as CloseIcon,
  RemoveRedEyeOutlined as EyeIcon,
  Star as StarIcon,
  LocalShippingOutlined as ShippingIcon,
  AutorenewOutlined as ReturnIcon,
  VerifiedUserOutlined as ShieldIcon,
  ShoppingCartOutlined as CartIcon,
  FavoriteBorder as HeartIcon,
  InfoOutlined as InfoIcon,
  KeyboardArrowDown as ChevronDownIcon,
  LayersOutlined as CubeIcon
} from '@mui/icons-material';

const COLOR_PALETTE = [
  { name: 'Core Black', hex: '#000000', value: 'black' },
  { name: 'Pure White', hex: '#FFFFFF', value: 'white' },
  { name: 'Crimson Red', hex: '#EF4444', value: 'red' },
  { name: 'Royal Blue', hex: '#3B82F6', value: 'blue' },
  { name: 'Volt Lime', hex: '#84CC16', value: 'lime' },
  { name: 'Olive Green', hex: '#65A30D', value: 'olive' },
  { name: 'Triple Slate', hex: '#64748B', value: 'slate' },
  { name: 'Desert Tan', hex: '#D97706', value: 'tan' }
];

const AVAILABLE_SIZES = ['6', '7', '8', '9', '10'];

export default function AddProduct() {
    const [formData, setFormData] = useState({
        productId: "",
        productName: "",
        brand: "",
        discription: "",
        specification: "",
        category: "",
        type: "",
        price: "",
        size: [],
        color: "",
        productImage: null, //file
    });

    const handleFormChange = (e) => {
        const { id, value, name } = e.target;
        setFormData({ ...formData, [id || name]: value });
    };

    const [images, setImages] = useState([]); // [{file, preview, tag, id, isMain}]
    const [activePreviewIndex, setActivePreviewIndex] = useState(0);

    const handleFilechange = (e) => {
        const files = Array.from(e.target.files);

        if (images.length + files.length > 5) {
            return toast.error("Max 5 images allowed");
        }

        const newImgs = files.map((file, i) => ({
            id: Date.now() + i,
            file,
            preview: URL.createObjectURL(file),
            tag: "gallery",
            isMain: images.length === 0 && i === 0
        }));

        setImages((prev) => [...prev, ...newImgs]);
    };

    const fileInputRef = useRef(null);

    const handleDeleteImage = (id, e) => {
        e.stopPropagation();
        const filtered = images.filter((img) => img.id !== id);
        if (!filtered.some((img) => img.isMain) && filtered.length > 0) {
            filtered[0].isMain = true;
        }
        setImages(filtered);
        setActivePreviewIndex(0);
    };

    const handleSetMainImage = (id) => {
        setImages((prev) =>
            prev.map((img) => ({
                ...img,
                isMain: img.id === id,
                tag: img.id === id ? "main" : "gallery"
            }))
        );
        const targetIdx = images.findIndex((img) => img.id === id);
        if (targetIdx !== -1) setActivePreviewIndex(targetIdx);
    };

    const [specInput, setSpecInput] = useState("");
    const [specification, setSpecification] = useState([]);

    const handleAddSpec = () => {
        if (!specInput.trim()) return;
        setSpecification([...specification, specInput]);
        setSpecInput(""); 
    };

    const handleRemoveSpec = (index) => {
        const updated = [...specification];
        updated.splice(index, 1);
        setSpecification(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = new FormData();
            payload.append("productId", formData.productId);
            payload.append("productName", formData.productName);
            payload.append("brand", formData.brand);
            payload.append("discription", formData.discription);
            payload.append("category", formData.category);
            payload.append("type", formData.type);
            payload.append("price", formData.price);
            payload.append("color", formData.color);

            formData.size.forEach((s) => {
                payload.append("size", s);
            });

            images.forEach((img) => {
                payload.append("productImages", img.file);
            });
            
            images.forEach((img) => {
                payload.append("imageTags", img.tag);
            });

            specification.forEach((spec) => {
                payload.append("specification", spec);
            });

            const { data } = await BaseUrl.post("/add-product", payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (data?.Success) {
                toast.success(data?.Message);

                setFormData({
                    productId: "",
                    productName: "",
                    brand:"",
                    discription: "",
                    specification: "",
                    category: "",
                    type: "",
                    price: "",
                    size: [],
                    color: "",
                    productImage: null,
                });
                setImages([]);
                setSpecification([]);

                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        } catch (error) {
            toast.error(error || "Something went wrong !");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 340px' }, gap: 3.5, alignItems: 'flex-start' }}>
                {/* LEFT CARD: Form */}
                <Box sx={{ 
                    display: 'flex', flexDirection: 'column', gap: 3,
                    height: { lg: 'calc(100vh - 120px)' },
                    overflowY: { lg: 'auto' },
                    pr: { lg: 1.5 },
                    pb: { lg: 4 },
                    '&::-webkit-scrollbar': { width: '6px' },
                    '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: '4px' }
                }}>
                    <PageHeader 
                        title="Add New Product" 
                        breadcrumbs={[
                            { label: 'Home', path: '/' },
                            { label: 'Products', path: '/products-table' },
                            { label: 'Add Product' }
                        ]} 
                    />
                    {/* Card 1: Product Identification */}
                    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3 }}>
                            <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: 'rgba(94, 72, 232, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5E48E8' }}>
                                <CubeIcon sx={{ fontSize: 18 }} />
                            </Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.05rem' }}>
                                Product Identification
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.75 }}>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>Product Name <Box component="span" sx={{ color: '#EF4444' }}>*</Box></Typography>
                                    <TextField fullWidth size="small" id="productName" value={formData.productName} onChange={handleFormChange} placeholder="Nike Air Max 270" required
                                        InputProps={{ startAdornment: <InputAdornment position="start"><TagIcon sx={{ color: 'text.disabled', fontSize: 19 }} /></InputAdornment> }}
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>Product ID <Box component="span" sx={{ color: '#EF4444' }}>*</Box></Typography>
                                    <TextField fullWidth size="small" id="productId" value={formData.productId} onChange={handleFormChange} placeholder="FV-001234" required
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><Typography sx={{ color: 'text.disabled', fontWeight: 700, fontSize: '1.05rem', mr: 0.5 }}>#</Typography></InputAdornment>,
                                            endAdornment: formData.productId ? <InputAdornment position="end"><CheckCircleIcon sx={{ color: '#10B981', fontSize: 20 }} /></InputAdornment> : null
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr' }, gap: 2.5 }}>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>Brand <Box component="span" sx={{ color: '#EF4444' }}>*</Box></Typography>
                                    <FormControl fullWidth size="small">
                                        <Select name="brand" value={formData.brand} onChange={handleFormChange}>
                                            <MenuItem value="Nike"><Typography variant="body2" sx={{ fontWeight: 600 }}>Nike</Typography></MenuItem>
                                            <MenuItem value="Adidas"><Typography variant="body2" sx={{ fontWeight: 600 }}>Adidas</Typography></MenuItem>
                                            <MenuItem value="Puma"><Typography variant="body2" sx={{ fontWeight: 600 }}>Puma</Typography></MenuItem>
                                            <MenuItem value="New Balance"><Typography variant="body2" sx={{ fontWeight: 600 }}>New Balance</Typography></MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>

                        </Box>
                    </Paper>

                    {/* Card 1.5: Specifications */}
                    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3 }}>
                            <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: 'rgba(94, 72, 232, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5E48E8' }}>
                                <BulletListIcon sx={{ fontSize: 18 }} />
                            </Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.05rem' }}>
                                Product Details
                            </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.75 }}>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>Product Description</Typography>
                                <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper' }}>
                                    <textarea rows={4} id="discription" value={formData.discription} onChange={handleFormChange} placeholder="Write product description here..." style={{ width: '100%', border: 'none', outline: 'none', padding: '14px', fontSize: '0.86rem', fontFamily: 'inherit', lineHeight: 1.6, resize: 'vertical', color: 'inherit', backgroundColor: 'transparent' }} />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                                    <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.72rem' }}>{formData.discription.length} / 1000</Typography>
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>Product Specification</Typography>
                                <Box sx={{ display: 'flex', gap: 1.5 }}>
                                    <TextField 
                                        fullWidth 
                                        size="small" 
                                        placeholder="e.g. Breathable mesh upper" 
                                        value={specInput}
                                        onChange={(e) => setSpecInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpec())}
                                    />
                                    <Button 
                                        variant="contained" 
                                        onClick={handleAddSpec}
                                        disabled={!specInput.trim()}
                                        sx={{ bgcolor: '#5E48E8', color: '#FFFFFF', fontWeight: 700, px: 3, borderRadius: 2, '&:hover': { bgcolor: '#4834D4' } }}
                                    >
                                        Add
                                    </Button>
                                </Box>
                            </Box>

                            {specification.length > 0 && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                                    {specification.map((spec, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                                • {spec}
                                            </Typography>
                                            <IconButton size="small" onClick={() => handleRemoveSpec(index)} sx={{ color: '#EF4444', bgcolor: 'rgba(239, 68, 68, 0.1)', '&:hover': { bgcolor: '#FECACA', color: '#DC2626' } }}>
                                                <CloseIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Paper>

                    {/* Card 2: Pricing & Category */}
                    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3 }}>
                            <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: 'rgba(94, 72, 232, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5E48E8' }}>
                                <TagIcon sx={{ fontSize: 18 }} />
                            </Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.05rem' }}>
                                Pricing & Category
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.75 }}>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>Price (₹) <Box component="span" sx={{ color: '#EF4444' }}>*</Box></Typography>
                                    <TextField fullWidth size="small" type="number" id="price" value={formData.price} onChange={handleFormChange} placeholder="7999" required
                                        InputProps={{ startAdornment: <InputAdornment position="start"><Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.95rem' }}>₹</Typography></InputAdornment> }}
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>Category <Box component="span" sx={{ color: '#EF4444' }}>*</Box></Typography>
                                    <FormControl fullWidth size="small">
                                        <Select name="category" value={formData.category} onChange={handleFormChange}>
                                            <MenuItem value="mens">Men's</MenuItem>
                                            <MenuItem value="womens">Women's</MenuItem>
                                            <MenuItem value="kids">Kids's</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr' }, gap: 2.5 }}>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.75 }}>Product Type <Box component="span" sx={{ color: '#EF4444' }}>*</Box></Typography>
                                    <FormControl fullWidth size="small">
                                        <Select name="type" value={formData.type} onChange={handleFormChange}>
                                            <MenuItem value="formals">Formals</MenuItem>
                                            <MenuItem value="partiwears">Partiwears</MenuItem>
                                            <MenuItem value="sandals">Sandals</MenuItem>
                                            <MenuItem value="casuals">Casuals</MenuItem>
                                            <MenuItem value="sports">Sports</MenuItem>
                                            <MenuItem value="sneakers">Sneakers</MenuItem>
                                            <MenuItem value="sleepers">Sleepers</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Card 3: Sizes & Colorways */}
                    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3 }}>
                            <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: 'rgba(94, 72, 232, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5E48E8' }}>
                                <GridIcon sx={{ fontSize: 18 }} />
                            </Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.05rem' }}>
                                Sizes & Colorways
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.75 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>Size <Box component="span" sx={{ color: '#EF4444' }}>*</Box></Typography>
                                        <Chip label={`${formData.size.length} active`} size="small" sx={{ bgcolor: 'rgba(79, 70, 229, 0.1)', color: (t) => t.palette.mode === 'dark' ? '#818CF8' : '#4F46E5', fontWeight: 700, height: 22, fontSize: '0.7rem' }} />
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                        {AVAILABLE_SIZES.map((sz) => {
                                            const isSelected = formData.size.includes(sz);
                                            return (
                                                <Box key={sz} onClick={() => {
                                                        const exists = formData.size.includes(sz);
                                                        setFormData({ ...formData, size: exists ? formData.size.filter(s => s !== sz) : [...formData.size, sz] });
                                                    }}
                                                    sx={{
                                                        px: 2.5, py: 1, borderRadius: '24px', border: '1px solid',
                                                        borderColor: isSelected ? '#5E48E8' : '#E2E8F0', bgcolor: isSelected ? '#5E48E8' : 'background.paper',
                                                        color: isSelected ? '#FFFFFF' : 'text.primary', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.15s ease',
                                                        minWidth: 64,
                                                        '&:hover': { borderColor: '#5E48E8' }
                                                    }}
                                                >
                                                    UK {sz}
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                </Box>

                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>Color <Box component="span" sx={{ color: '#EF4444' }}>*</Box></Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Pick all available colorways</Typography>
                                    </Box>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 1.5 }}>
                                        {COLOR_PALETTE.map((color) => {
                                            const isSelected = formData.color === color.value;
                                            return (
                                                <Box key={color.name} onClick={() => setFormData({...formData, color: color.value})} sx={{
                                                    display: 'flex', alignItems: 'center', gap: 1.5, p: 1.25, borderRadius: '12px',
                                                    border: '1px solid', borderColor: isSelected ? '#5E48E8' : '#E2E8F0', bgcolor: isSelected ? 'rgba(94, 72, 232, 0.1)' : 'background.paper',
                                                    cursor: 'pointer', transition: 'all 0.15s ease', '&:hover': { borderColor: '#5E48E8' }
                                                }}>
                                                    <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: color.hex, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid', borderColor: 'divider', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                                        {isSelected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color.hex === '#FFFFFF' ? '#000' : '#FFFFFF'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                                                    </Box>
                                                    <Typography variant="body2" sx={{ fontWeight: isSelected ? 700 : 500, color: isSelected ? '#1E1E2F' : '#475569', fontSize: '0.86rem' }}>{color.name}</Typography>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Card 4: Upload Product Images */}
                    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 3 }}>
                            <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: 'rgba(94, 72, 232, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5E48E8' }}>
                                <ImageIcon sx={{ fontSize: 18 }} />
                            </Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1.05rem' }}>
                                Upload Product Images
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.75 }}>
                            <Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Box onClick={() => fileInputRef.current?.click()} sx={{
                                        border: '2px dashed', borderColor: 'divider', borderRadius: '16px', py: 4, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        textAlign: 'center', bgcolor: 'background.paper', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { borderColor: '#5E48E8', bgcolor: 'background.default' }, mb: 4
                                    }}>
                                        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFilechange} style={{ display: 'none' }} />
                                        <Box sx={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                            <UploadCloudIcon sx={{ fontSize: 24, color: '#5E48E8' }} />
                                        </Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1rem', mb: 0.5 }}>Drop footwear photography here or click to browse local files</Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>High-res JPG, PNG or WEBP recommended • Auto-synchronized with live storefront preview</Typography>
                                    </Box>

                                    {images.length > 0 && (
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.8rem' }}>ASSET GALLERY ({images.length})</Typography>
                                                    <Typography variant="caption" sx={{ color: '#5E48E8', fontWeight: 600, fontSize: '0.8rem' }}>• Primary Cover Active / Hover View Active</Typography>
                                                </Box>
                                                <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>Fixed 176px frame • No stretching or white gaps</Typography>
                                            </Box>

                                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                                                {images.map((img, idx) => {
                                                    let label = "GALLERY VIEW";
                                                    let labelColor = "#94A3B8";
                                                    let borderColor = "#E2E8F0";
                                                    let badgeIcon = <ImageIcon sx={{ fontSize: 14, mr: 0.5 }} />;
                                                    let bottomText = "🖼️ Gallery Image";
                                                    let bottomBg = "#FFFFFF";
                                                    
                                                    const isPrimary = img.isMain || (idx === 0 && !images.find(i=>i.isMain));

                                                    if (isPrimary) {
                                                        label = "PRIMARY COVER";
                                                        labelColor = "#5E48E8";
                                                        borderColor = "#5E48E8";
                                                        badgeIcon = <StarIcon sx={{ fontSize: 14, mr: 0.5 }} />;
                                                        bottomText = "★ Main Image (Cover)";
                                                        bottomBg = "#F3F0FF";
                                                    } else if (idx === 1) {
                                                        label = "HOVER VIEW";
                                                        labelColor = "#F59E0B";
                                                        borderColor = "#F59E0B";
                                                        badgeIcon = <ReturnIcon sx={{ fontSize: 14, mr: 0.5 }} />;
                                                        bottomText = "⚡ Hover Image";
                                                        bottomBg = "#FFFBEB";
                                                    }

                                                    return (
                                                        <Box key={img.id} sx={{
                                                            borderRadius: '16px', border: '2px solid', borderColor: borderColor, overflow: 'hidden', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', transition: 'transform 0.15s ease', '&:hover': { transform: 'translateY(-2px)' }
                                                        }}>
                                                            <Box sx={{ position: 'relative', height: 176, bgcolor: 'background.default' }}>
                                                                <Box component="img" src={img.preview} alt="Thumb" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                <Box onClick={(e) => handleDeleteImage(img.id, e)} sx={{ position: 'absolute', top: 12, right: 12, width: 26, height: 26, borderRadius: '50%', bgcolor: 'rgba(0,0,0,0.5)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2, '&:hover': { bgcolor: '#EF4444' } }}>
                                                                    <CloseIcon sx={{ fontSize: 14 }} />
                                                                </Box>
                                                            </Box>
                                                            <Box sx={{ p: 1, bgcolor: bottomBg, borderTop: '1px solid', borderColor: borderColor === '#E2E8F0' ? 'divider' : 'transparent', display: 'flex', alignItems: 'center' }}>
                                                                <FormControl fullWidth size="small" variant="standard" sx={{ '& .MuiInput-underline:before': { borderBottom: 'none' }, '& .MuiInput-underline:after': { borderBottom: 'none' }, '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' }, ml: 1 }}>
                                                                    <Select 
                                                                        value={isPrimary ? 'main' : (idx === 1 ? 'hover' : 'gallery')} 
                                                                        onChange={(e) => {
                                                                            const val = e.target.value;
                                                                            if (val === 'main') {
                                                                                handleSetMainImage(img.id);
                                                                            } else if (val === 'hover') {
                                                                                const newImages = [...images];
                                                                                const currentIndex = newImages.findIndex(i => i.id === img.id);
                                                                                if(currentIndex !== 1 && newImages.length > 1) {
                                                                                    const temp = newImages[1];
                                                                                    newImages[1] = newImages[currentIndex];
                                                                                    newImages[currentIndex] = temp;
                                                                                    newImages.forEach(i => i.isMain = false);
                                                                                    newImages[0].isMain = true;
                                                                                    setImages(newImages);
                                                                                }
                                                                            }
                                                                        }}
                                                                        sx={{ color: labelColor, fontWeight: 800, fontSize: '0.85rem', '& .MuiSelect-icon': { color: labelColor } }}
                                                                    >
                                                                        <MenuItem value="main" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>★ Main Image (Cover)</MenuItem>
                                                                        <MenuItem value="hover" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>⚡ Hover Image</MenuItem>
                                                                        <MenuItem value="gallery" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>🖼️ Gallery Image</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Box>
                                                        </Box>
                                                    );
                                                })}
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                    {/* Bottom Buttons */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setFormData({
                                    productId: "", productName: "", brand:"", discription: "",
                                    specification: "", category: "", type: "", price: "", size: [], color: "", productImage: null,
                                });
                                setImages([]);
                            }}
                            sx={{
                                borderColor: 'divider', color: 'text.primary', bgcolor: 'background.paper', px: 2, py: 0.9, borderRadius: 2,
                                fontWeight: 700, fontSize: '0.86rem', '&:hover': { borderColor: 'divider', bgcolor: 'background.default' }
                            }}
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                bgcolor: '#5E48E8', color: '#FFFFFF', px: 2.75, py: 0.9, borderRadius: 2,
                                fontWeight: 700, fontSize: '0.86rem', boxShadow: '0 4px 14px rgba(94, 72, 232, 0.3)',
                                '&:hover': { bgcolor: '#4834D4' }
                            }}
                        >
                            Create Product
                        </Button>
                    </Box>
                    </Box>

                    {/* RIGHT CARD: Preview */}
                    <Box>
                        <Paper elevation={0} sx={{ borderRadius: '24px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.default', overflow: 'hidden' }}>
                            {/* Image Area */}
                            <Box sx={{ 
                                position: 'relative', height: 290, bgcolor: 'background.default',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                                '&:hover .hover-img': { opacity: 1 },
                                '&:hover .main-img': { opacity: 0 }
                            }}>
                                {images.length > 0 ? (
                                    <>
                                        <Box className="main-img" component="img" src={images.find(i=>i.isMain)?.preview || images[0]?.preview} alt="Product Showcase" sx={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease', opacity: 1 }} />
                                        {images.length > 1 && (
                                            <Box className="hover-img" component="img" src={images[1]?.preview} alt="Hover Showcase" sx={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease', opacity: 0 }} />
                                        )}
                                    </>
                                ) : (
                                    <Typography variant="body2" sx={{ color: 'text.disabled', fontWeight: 700, opacity: 0.8 }}>No Image</Typography>
                                )}

                                {/* Top Badges */}
                                <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 1 }}>
                                    <Chip label={formData.category ? formData.category.toUpperCase() : "UNISEX"} sx={{ bgcolor: 'divider', color: 'text.primary', fontWeight: 800, height: 28, fontSize: '0.75rem', borderRadius: 1.5 }} />
                                    {formData.price && (
                                        <Chip label="18% OFF" sx={{ bgcolor: '#E11D48', color: '#FFFFFF', fontWeight: 800, height: 28, fontSize: '0.75rem', borderRadius: 1.5 }} />
                                    )}
                                </Box>
                                <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
                                    <Chip label={formData.brand || "Brand"} sx={{ bgcolor: 'background.paper', color: 'text.primary', fontWeight: 800, height: 28, fontSize: '0.75rem', borderRadius: 1.5 }} />
                                    <Box sx={{ width: 28, height: 28, bgcolor: 'background.paper', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                                        <HeartIcon sx={{ fontSize: 16 }} />
                                    </Box>
                                </Box>

                                {/* Bottom Badges */}
                                <Box sx={{ position: 'absolute', bottom: 16, left: 16 }}>
                                    <Chip icon={<ReturnIcon sx={{ fontSize: 14 }} />} label="Hover to preview Angle 2" sx={{ bgcolor: 'background.paper', backdropFilter: 'blur(4px)', color: 'text.secondary', fontWeight: 700, height: 28, fontSize: '0.75rem', borderRadius: 3, '& .MuiChip-icon': { color: 'text.secondary' } }} />
                                </Box>
                                <Box sx={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', gap: 0.5 }}>
                                    <Box sx={{ width: 14, height: 6, borderRadius: 3, bgcolor: (t) => t.palette.mode === 'dark' ? '#818CF8' : '#4F46E5' }} />
                                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'divider' }} />
                                </Box>
                            </Box>

                            {/* Details Area */}
                            <Box sx={{ p: 2.5, pt: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, letterSpacing: 0.5 }}>{formData.productId || 'NK-PULSE-26X'}</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <StarIcon sx={{ color: '#F59E0B', fontSize: 14 }} />
                                        <Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 800 }}>4.9</Typography>
                                    </Box>
                                </Box>

                                <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', fontSize: '1.4rem', lineHeight: 1.2, mb: 0.25 }}>{formData.productName || 'Nike Air Max Pulse 2026'}</Typography>
                                <Typography variant="caption" sx={{ color: (t) => t.palette.mode === 'dark' ? '#818CF8' : '#4F46E5', fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase' }}>{formData.type || 'SNEAKERS'}</Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2.5, mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                                        <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', fontSize: '1.75rem', lineHeight: 1 }}>₹{formData.price || '0'}</Typography>
                                        <Typography variant="body1" sx={{ color: 'text.disabled', fontWeight: 600, textDecoration: 'line-through', mb: 0.25 }}>₹{formData.price ? (Number(formData.price) * 1.18).toFixed(0) : '0'}</Typography>
                                    </Box>
                                    <Chip label="In Stock: 48" sx={{ bgcolor: 'rgba(5, 150, 105, 0.1)', color: (t) => t.palette.mode === 'dark' ? '#34D399' : '#059669', fontWeight: 800, height: 26, fontSize: '0.75rem', borderRadius: 1.5 }} />
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>COLOR:</Typography>
                                        <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 800, textTransform: 'uppercase' }}>{COLOR_PALETTE.find(c => c.value === formData.color)?.name || 'CORE BLACK'}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                        {formData.color ? (
                                            <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: COLOR_PALETTE.find(c => c.value === formData.color)?.hex || '#000000', border: '3px solid #E0E7FF', outline: '2px solid #4F46E5', outlineOffset: -1 }} />
                                        ) : (
                                            <Typography variant="caption" sx={{ color: 'text.disabled' }}>Select color...</Typography>
                                        )}
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3.5 }}>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>SIZE (UK):</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                        {(formData.size.length > 0 ? formData.size : ['7', '8', '9', '10']).map((sz, i) => (
                                            <Box key={sz} sx={{ 
                                                width: 26, height: 26, borderRadius: '4px', 
                                                bgcolor: i === (formData.size.length > 0 ? formData.size.length - 1 : 2) ? '#4F46E5' : '#E2E8F0', 
                                                color: i === (formData.size.length > 0 ? formData.size.length - 1 : 2) ? '#FFFFFF' : '#64748B', 
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' 
                                            }}>
                                                {sz}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>

                                <Button fullWidth variant="contained" startIcon={<CartIcon sx={{ fontSize: 18 }} />} sx={{ 
                                    bgcolor: '#5E48E8', color: '#FFFFFF', py: 1.5, borderRadius: 2.5, fontWeight: 800, fontSize: '0.95rem',
                                    textTransform: 'none', boxShadow: '0 4px 14px rgba(94, 72, 232, 0.3)',
                                    '&:hover': { bgcolor: '#4834D4' }
                                }}>
                                    Add to Cart • ₹{formData.price || '0'}
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                </Box>
        </form>
    );
}
