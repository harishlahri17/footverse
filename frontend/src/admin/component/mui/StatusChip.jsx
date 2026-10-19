import React from 'react';
import { Chip } from '@mui/material';

export default function StatusChip({ status, label }) {
  const getStatusColor = (s) => {
    switch (s?.toLowerCase()) {
      case 'placed':
        return 'primary';
      case 'confirmed':
        return 'info';
      case 'packed':
        return 'warning';
      case 'shipped':
        return 'secondary';
      case 'out_for_delivery':
      case 'out for delivery':
        return 'default';
      case 'delivered':
      case 'active':
      case 'paid':
        return 'success';
      case 'cancelled':
      case 'inactive':
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Chip 
      label={label || status} 
      color={getStatusColor(status)} 
      size="small" 
      sx={{ fontWeight: 600 }}
    />
  );
}
