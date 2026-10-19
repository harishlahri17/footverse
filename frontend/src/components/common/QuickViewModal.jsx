import React, { useState } from 'react';
import { 
    Dialog, DialogContent, IconButton, Box, Typography, Button, 
    Stack, Chip, Divider, Grid, useMediaQuery, useTheme 
} from '@mui/material';
import { Close, ShoppingBagOutlined, ShoppingCart } from '@mui/icons-material';
import Rating from './Rating';
import Price from './Price';
import { useNavigate } from 'react-router-dom';

export default function QuickViewModal({ open, onClose, product, onAddToCart }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');

    if (!product) return null;

    const {
        id, name, brand, image, hoverImage, rating, reviewsCount, 
        price, originalPrice, description, sizes = [], colors = [], countInStock
    } = product;

    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart({ ...product, selectedSize, selectedColor, quantity: 1 });
        }
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
        >
            <IconButton
                onClick={onClose}
                sx={{
                    position: 'absolute', right: 16, top: 16, zIndex: 10,
                    bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '&:hover': { bgcolor: 'grey.100' }
                }}
            >
                <Close />
            </IconButton>

            <DialogContent sx={{ p: 0 }}>
                <Grid container>
                    {/* Image Section */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ 
                            height: { xs: 300, md: '100%' }, 
                            bgcolor: 'grey.50',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            p: 4, position: 'relative'
                        }}>
                            <Box 
                                component="img" 
                                src={image || '/placeholder-shoe.png'} 
                                alt={name}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/placeholder-shoe.png';
                                }}
                                sx={{ 
                                    maxWidth: '100%', maxHeight: '100%', 
                                    objectFit: 'contain',
                                    filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.15))'
                                }}
                            />
                        </Box>
                    </Grid>

                    {/* Details Section */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: { xs: 3, md: 5 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="overline" color="text.secondary" fontWeight={600} letterSpacing={1.5}>
                                {brand || 'FootVerse'}
                            </Typography>
                            
                            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 1 }}>
                                {name}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Rating rating={rating || 0} count={reviewsCount || 0} />
                                {countInStock > 0 ? (
                                    <Chip size="small" label="In Stock" color="success" variant="outlined" />
                                ) : (
                                    <Chip size="small" label="Out of Stock" color="error" variant="outlined" />
                                )}
                            </Box>

                            <Price price={price} originalPrice={originalPrice} large />

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 3, mb: 4, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {description || "Discover the perfect blend of style and comfort with this premium footwear. Designed for durability and all-day wear."}
                            </Typography>

                            <Divider sx={{ mb: 3 }} />

                            {/* Options */}
                            <Stack spacing={3} sx={{ flexGrow: 1 }}>
                                {sizes && sizes.length > 0 && (
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                            Select Size <Typography component="span" variant="caption" color="error">*</Typography>
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {sizes.map((s) => (
                                                <Button
                                                    key={s}
                                                    variant={selectedSize === s ? 'contained' : 'outlined'}
                                                    onClick={() => setSelectedSize(s)}
                                                    sx={{ 
                                                        minWidth: 48, p: 1, borderRadius: 2,
                                                        borderColor: selectedSize === s ? 'primary.main' : 'grey.300',
                                                        color: selectedSize === s ? 'white' : 'text.primary'
                                                    }}
                                                >
                                                    {s}
                                                </Button>
                                            ))}
                                        </Box>
                                    </Box>
                                )}

                                {colors && colors.length > 0 && (
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                            Select Color <Typography component="span" variant="caption" color="error">*</Typography>
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            {colors.map((c) => (
                                                <Box
                                                    key={c}
                                                    onClick={() => setSelectedColor(c)}
                                                    sx={{
                                                        width: 32, height: 32, borderRadius: '50%',
                                                        bgcolor: c, cursor: 'pointer',
                                                        border: selectedColor === c ? '2px solid #000' : '2px solid transparent',
                                                        boxShadow: '0 0 0 1px #E5E7EB inset',
                                                        transition: 'transform 0.2s',
                                                        '&:hover': { transform: 'scale(1.1)' }
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                            </Stack>

                            {/* Actions */}
                            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    fullWidth 
                                    size="large"
                                    startIcon={<ShoppingCart />}
                                    onClick={handleAddToCart}
                                    disabled={countInStock === 0 || ((sizes.length > 0 && !selectedSize) || (colors.length > 0 && !selectedColor))}
                                    sx={{ py: 1.5, borderRadius: 3, fontWeight: 'bold' }}
                                >
                                    Add to Cart
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    size="large"
                                    onClick={() => {
                                        navigate(`/product-details/${id}`);
                                        onClose();
                                    }}
                                    sx={{ py: 1.5, borderRadius: 3, fontWeight: 'bold', whiteSpace: 'nowrap' }}
                                >
                                    View Details
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}
