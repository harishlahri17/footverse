import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { 
    Box, 
    Typography, 
    Avatar, 
    Chip, 
    Divider, 
    useMediaQuery,
    Stack
} from '@mui/material';
import EmptyState from './EmptyState';

export default function TopProducts({ orders = [], products = [] }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const topProducts = useMemo(() => {
        if (!orders || !orders.length) return [];

        const productStats = {};

        // Aggregate sales data from orders
        orders.forEach(order => {
            if (!order) return;
            const status = (order.orderStatus || '').toLowerCase();
            if (status === 'cancelled' || status === 'returned') return;
            
            if (Array.isArray(order.items)) {
                order.items.forEach(item => {
                    if (!item) return;

                    // Item might have productId populated as an object, an ID string, or null (if deleted)
                    let pId = null;
                    let populatedProduct = null;

                    if (item.productId && typeof item.productId === 'object') {
                        pId = item.productId._id?.toString() || item.productId.id?.toString();
                        populatedProduct = item.productId;
                    } else if (item.productId && typeof item.productId === 'string') {
                        pId = item.productId;
                    }

                    if (!pId) return;

                    if (!productStats[pId]) {
                        productStats[pId] = { 
                            id: pId, 
                            qtySold: 0, 
                            revenue: 0,
                            productData: populatedProduct
                        };
                    }
                    productStats[pId].qtySold += (Number(item.qty) || 0);
                    productStats[pId].revenue += (Number(item.price) || 0) * (Number(item.qty) || 0);
                });
            }
        });

        // Merge with product details
        const combined = Object.values(productStats).map(stat => {
            const product = (Array.isArray(products) && products.find(p => p && (p._id?.toString() === stat.id || p.id?.toString() === stat.id)))
                || stat.productData 
                || {};

            // Extract main image URL
            let imageUrl = '';
            if (Array.isArray(product.productImage) && product.productImage.length > 0) {
                const mainImg = product.productImage.find(img => img?.tag === 'main') || product.productImage[0];
                if (mainImg?.url) {
                    imageUrl = mainImg.url.startsWith('http') 
                        ? mainImg.url 
                        : `http://localhost:5000/media/products/${mainImg.url}`;
                }
            } else if (Array.isArray(product.images) && product.images.length > 0) {
                const img = product.images[0];
                imageUrl = typeof img === 'string' ? img : (img?.url || '');
            }

            return {
                ...stat,
                name: product.productName || product.name || 'Product (Unavailable)',
                image: imageUrl,
                category: product.category || product.brand || 'Footwear',
                stock: product.stock !== undefined ? product.stock : 10,
                status: product.status || 'active'
            };
        });

        // Sort by revenue descending and take top 5
        return combined.sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    }, [orders, products]);

    if (topProducts.length === 0) {
        return (
            <EmptyState 
                title="No Top Products"
                message="Best selling products will appear here once orders are placed."
                height={350}
            />
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            {topProducts.map((product, index) => (
                <React.Fragment key={product.id}>
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: isMobile ? 'column' : 'row',
                            alignItems: isMobile ? 'flex-start' : 'center', 
                            py: 2,
                            px: 2,
                            gap: 2,
                            transition: 'background-color 0.2s',
                            '&:hover': {
                                bgcolor: 'action.hover'
                            }
                        }}
                    >
                        {/* Rank & Image */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: isMobile ? '100%' : '35%' }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ width: 20 }}>
                                #{index + 1}
                            </Typography>
                            <Avatar 
                                src={product.image} 
                                variant="rounded"
                                sx={{ width: 48, height: 48, bgcolor: 'background.default', border: `1px solid ${theme.palette.divider}` }}
                            >
                                {(product.name || 'P').charAt(0).toUpperCase()}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="subtitle2" noWrap fontWeight="600" title={product.name}>
                                    {product.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" noWrap display="block">
                                    ID: {product.id ? String(product.id).slice(-6).toUpperCase() : 'N/A'} • {product.category}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Stats Group */}
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: isMobile ? 'space-between' : 'flex-end',
                                width: isMobile ? '100%' : '65%',
                                gap: 3
                            }}
                        >
                            <Box sx={{ textAlign: isMobile ? 'left' : 'right' }}>
                                <Typography variant="body2" color="text.secondary">Sales</Typography>
                                <Typography variant="subtitle2" fontWeight="600">{product.qtySold} units</Typography>
                            </Box>
                            
                            <Box sx={{ textAlign: isMobile ? 'left' : 'right' }}>
                                <Typography variant="body2" color="text.secondary">Revenue</Typography>
                                <Typography variant="subtitle2" fontWeight="600" color="success.main">
                                    ${product.revenue.toLocaleString()}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {product.stock > 0 ? (
                                    <Chip label={`${product.stock} in stock`} size="small" color="default" variant="outlined" />
                                ) : (
                                    <Chip label="Out of stock" size="small" color="error" variant="outlined" />
                                )}
                            </Box>
                        </Box>
                    </Box>
                    {index < topProducts.length - 1 && <Divider />}
                </React.Fragment>
            ))}
        </Box>
    );
}
