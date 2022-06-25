import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MainCard from '../../../components/Cards/MainCard';

function AuthCard({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <MainCard
        sx={{
            maxWidth: { xs: 400, lg: 475 },
            margin: { xs: 2.5, md: 3 },
            '& > *': {
                flexGrow: 1,
                flexBasis: '50%'
            }
        }}
        content={false}
        border={false}
        boxShadow
        shadow={theme.shadows[15]}
    >
        <Box sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>{children}</Box>
    </MainCard>
  )
}

export default AuthCard