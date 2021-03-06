import React from 'react';
// material-ui
import { Grid, Stack, Typography } from '@mui/material';
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useAuth } from '../hocs/providers/AuthProvider';
import Link from "next/link";

const AuthRegister = dynamic(() => import('../components/Forms/Auth/RegisterForm'));

function RegisterPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (user) router.push("/");

  return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                    <Typography variant="h3">Sign up</Typography>
                    <Typography variant="body1" sx={{ textDecoration: 'none' }} color="primary">
                        <Link href="/login">Already have an account?</Link>
                    </Typography>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <AuthRegister />
            </Grid>
        </Grid>
  )
}

export default RegisterPage