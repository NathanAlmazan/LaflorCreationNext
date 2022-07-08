import React from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useAuth } from '../hocs/providers/AuthProvider';
import Link from "next/link";

const AuthLogin = dynamic(() => import('../components/Forms/Auth/LoginForm'));

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
                        <Link href="/register">Don&apos;t have an account?</Link>
                    </Typography>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <AuthLogin />
            </Grid>
        </Grid>
  )
}

