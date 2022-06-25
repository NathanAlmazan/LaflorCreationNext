import React from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import AuthWrapper from '../hocs/layout/AuthWrapper';
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useAuth } from '../hocs/providers/AuthProvider';

const AuthLogin = dynamic(() => import('../components/AuthForms/LoginForm'));

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (user) router.push("/");
  return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                    <Typography variant="h3">Login</Typography>
                    <Typography variant="body1" sx={{ textDecoration: 'none' }} color="primary">
                        Don&apos;t have an account?
                    </Typography>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <AuthLogin />
            </Grid>
        </Grid>
  )
}

