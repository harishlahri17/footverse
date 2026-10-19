import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Divider,
  InputBase,
  Badge,
  alpha,
  styled,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  NotificationsOutlined as NotificationsIcon,
  Brightness4Outlined as DarkIcon,
  Brightness7Outlined as LightIcon,
  Search as SearchIcon,
  MailOutlined as MailIcon,
  AccountCircleOutlined as AccountCircle,
  SettingsOutlined as SettingsIcon,
  HelpOutlineOutlined as HelpIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../../../theme/ThemeContextProvider';
import { useAuth } from '../../../store/auth';
import { useNavigate } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '24px',
  backgroundColor: theme.palette.mode === 'light' ? alpha(theme.palette.text.primary, 0.04) : alpha(theme.palette.common.white, 0.05),
  border: `1px solid ${theme.palette.mode === 'light' ? alpha(theme.palette.text.primary, 0.05) : alpha(theme.palette.common.white, 0.08)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' ? alpha(theme.palette.text.primary, 0.06) : alpha(theme.palette.common.white, 0.08),
    border: `1px solid ${theme.palette.primary.light}`,
  },
  '&:focus-within': {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.primary.main}`,
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  display: 'none',
  [theme.breakpoints.up('sm')]: {
    display: 'block',
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '0.875rem',
    [theme.breakpoints.up('md')]: {
      width: '28ch',
    },
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: '10px',
  padding: '8px',
  transition: 'all 0.2s ease',
  backgroundColor: theme.palette.mode === 'light' ? 'transparent' : alpha(theme.palette.common.white, 0.02),
  border: `1px solid transparent`,
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' ? alpha(theme.palette.primary.main, 0.04) : alpha(theme.palette.common.white, 0.05),
    border: `1px solid ${theme.palette.mode === 'light' ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.common.white, 0.1)}`,
  }
}));

export default function Header({ handleDrawerToggle, drawerWidth }) {
  const { toggleColorMode, mode } = useThemeContext();
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationEl, setNotificationEl] = React.useState(null);
  const [messageEl, setMessageEl] = React.useState(null);
  
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleNotificationClick = (event) => setNotificationEl(event.currentTarget);
  const handleNotificationClose = () => setNotificationEl(null);

  const handleMessageClick = (event) => setMessageEl(event.currentTarget);
  const handleMessageClose = () => setMessageEl(null);

  const handleLogout = () => {
    if(logoutUser) logoutUser();
    navigate('/');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: mode === 'light' ? alpha('#ffffff', 0.8) : alpha('#1e293b', 0.8),
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${mode === 'light' ? 'rgba(15, 23, 42, 0.06)' : 'rgba(255, 255, 255, 0.06)'}`,
      }}
    >
      <Toolbar sx={{ minHeight: '70px !important' }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' }, color: 'text.primary' }}
        >
          <MenuIcon />
        </IconButton>
        
        <Search>
          <SearchIconWrapper>
            <SearchIcon fontSize="small" />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search FootVerse..."
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          
          <StyledIconButton onClick={toggleColorMode} sx={{ color: 'text.secondary' }}>
            {mode === 'dark' ? <LightIcon fontSize="small" /> : <DarkIcon fontSize="small" />}
          </StyledIconButton>
          
          <StyledIconButton onClick={handleMessageClick} sx={{ color: 'text.secondary' }}>
            <Badge badgeContent={3} color="primary" sx={{ '& .MuiBadge-badge': { right: 2, top: 2 } }}>
              <MailIcon fontSize="small" />
            </Badge>
          </StyledIconButton>

          <StyledIconButton onClick={handleNotificationClick} sx={{ color: 'text.secondary' }}>
            <Badge badgeContent={4} color="error" sx={{ '& .MuiBadge-badge': { right: 2, top: 2 } }}>
              <NotificationsIcon fontSize="small" />
            </Badge>
          </StyledIconButton>
          
          <Menu
            anchorEl={notificationEl}
            open={Boolean(notificationEl)}
            onClose={handleNotificationClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{ sx: { width: 320, mt: 1.5 } }}
          >
            <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Notifications</Typography>
              <Badge badgeContent="4 New" color="error" />
            </Box>
            <Divider />
            <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
              <Typography variant="body2">Lorem Ipsum - <Typography component="span" variant="caption" color="text.secondary">30 min ago</Typography></Typography>
            </MenuItem>
            <MenuItem onClick={handleNotificationClose} sx={{ py: 1.5 }}>
              <Typography variant="body2">Atque rerum nesciunt - <Typography component="span" variant="caption" color="text.secondary">1 hr ago</Typography></Typography>
            </MenuItem>
          </Menu>

          <Menu
            anchorEl={messageEl}
            open={Boolean(messageEl)}
            onClose={handleMessageClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{ sx: { width: 320, mt: 1.5 } }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Messages (3)</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleMessageClose} sx={{ py: 1.5 }}>
              <Typography variant="body2">Maria Hudson - <Typography component="span" variant="caption" color="text.secondary">4 hrs ago</Typography></Typography>
            </MenuItem>
          </Menu>
          
          <Divider orientation="vertical" flexItem sx={{ my: 2, mx: 1 }} />

          <IconButton
            size="small"
            onClick={handleMenu}
            sx={{ ml: 0.5, p: 0.5, border: `2px solid transparent`, transition: 'all 0.2s', '&:hover': { borderColor: 'primary.main' } }}
          >
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontWeight: 600, fontSize: '1rem' }}>
              {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{ sx: { width: 240, mt: 1.5 } }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{user?.fullName || 'Admin User'}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {user?.email || 'admin@footverse.com'}
              </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <MenuItem onClick={handleClose} sx={{ py: 1, gap: 1.5 }}>
              <AccountCircle fontSize="small" color="action" /> My Profile
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ py: 1, gap: 1.5 }}>
              <SettingsIcon fontSize="small" color="action" /> Account Settings
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ py: 1, gap: 1.5 }}>
              <HelpIcon fontSize="small" color="action" /> Need Help?
            </MenuItem>
            <Divider sx={{ mt: 1, mb: 1 }} />
            <MenuItem onClick={handleLogout} sx={{ py: 1, gap: 1.5, color: 'error.main' }}>
              <LogoutIcon fontSize="small" color="error" /> Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
