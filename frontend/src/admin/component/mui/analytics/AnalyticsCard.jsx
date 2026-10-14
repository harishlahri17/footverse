import React from 'react';
import { Card, CardHeader, CardContent, Divider, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function AnalyticsCard({ 
    title, 
    subheader,
    action, 
    children, 
    noPadding = false,
    headerActionMenu = null // Array of { label: string, onClick: () => void }
}) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const renderAction = () => {
        if (action) return action;
        if (headerActionMenu && headerActionMenu.length > 0) {
            return (
                <>
                    <IconButton onClick={handleMenuClick} size="small">
                        <MoreVertIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        {headerActionMenu.map((menuItem, idx) => (
                            <MenuItem 
                                key={idx} 
                                onClick={() => {
                                    handleMenuClose();
                                    menuItem.onClick();
                                }}
                            >
                                {menuItem.label}
                            </MenuItem>
                        ))}
                    </Menu>
                </>
            );
        }
        return null;
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {(title || action || headerActionMenu) && (
                <>
                    <CardHeader 
                        title={title} 
                        subheader={subheader}
                        action={renderAction()} 
                        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                        sx={{ pb: 2 }}
                    />
                    <Divider />
                </>
            )}
            <CardContent sx={{ flexGrow: 1, p: noPadding ? 0 : 3, '&:last-child': { pb: noPadding ? 0 : 3 } }}>
                {children}
            </CardContent>
        </Card>
    );
}
