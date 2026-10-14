import React, { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import getDeliveryDesignTokens from './deliveryTheme';

const DeliveryThemeContext = createContext();

export const useDeliveryThemeContext = () => useContext(DeliveryThemeContext);

export const DeliveryThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('deliveryThemeMode');
    return savedMode ? savedMode : 'light';
  });

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('deliveryThemeMode', newMode);
          return newMode;
        });
      },
      mode,
    }),
    [mode],
  );

  const theme = useMemo(() => createTheme(getDeliveryDesignTokens(mode)), [mode]);

  return (
    <DeliveryThemeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </DeliveryThemeContext.Provider>
  );
};
