import React from 'react';
import { ThemeProvider } from '@mui/material';
import { themeCreator } from './base';
import { StylesProvider } from '@mui/styles';

const ThemeProviderWrapper = (props: { children: React.ReactNode }) => {
  const theme = themeCreator('PureLightTheme');

  return (
    <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </StylesProvider>
  );
};

export default ThemeProviderWrapper;
