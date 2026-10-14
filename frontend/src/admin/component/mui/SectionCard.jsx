import React from 'react';
import { Card, CardContent, CardHeader, Divider } from '@mui/material';

export default function SectionCard({ title, action, children, sx = {} }) {
  return (
    <Card sx={{ ...sx, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {(title || action) && (
        <>
          <CardHeader 
            title={title} 
            action={action} 
            titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }} 
          />
          <Divider />
        </>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        {children}
      </CardContent>
    </Card>
  );
}
