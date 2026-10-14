import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogContentText, 
  DialogActions, Button, IconButton, Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

export default function ConfirmDialog({ 
  open, 
  title, 
  content, 
  cancelText = 'Cancel', 
  confirmText = 'Confirm', 
  onCancel, 
  onConfirm,
  isDestructive = false
}) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: { borderRadius: 3, minWidth: 320 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ fontWeight: 700 }}>{title}</Box>
        <IconButton
          aria-label="close"
          onClick={onCancel}
          sx={{ color: 'text.secondary' }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2, pt: 1 }}>
        <DialogContentText color="text.secondary">
          {content}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onCancel} color="inherit" variant="outlined" sx={{ borderRadius: 2 }}>
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          color={isDestructive ? 'error' : 'primary'} 
          variant="contained"
          sx={{ borderRadius: 2 }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
