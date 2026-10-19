import React from 'react'
import { useAuth } from '../../store/auth';
import { Navigate } from 'react-router-dom';
import { DeliveryThemeContextProvider } from '../../theme/DeliveryThemeContextProvider';

export default function DeliveryProtectedRouted({children}) {
    const {token} = useAuth();
    if(!token){
        return <Navigate to="/" replace /> ;
    }

  return (
    <DeliveryThemeContextProvider>
      {children}
    </DeliveryThemeContextProvider>
  );
}
