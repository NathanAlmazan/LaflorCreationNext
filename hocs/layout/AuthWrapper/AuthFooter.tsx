// material-ui
import { Container, Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

const AuthFooter = () => {
    return (
        <Container maxWidth="xl">
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent={{ xs: 'center', md: 'space-between' }}
                spacing={2}
                textAlign={{ xs: 'center', md: 'inherit' }}
            >
                <Typography variant="subtitle2" color="secondary" component="span">
                    &copy; Mantis React Dashboard Template By&nbsp;
                    <Typography component={Link} variant="subtitle2" href="https://codedthemes.com" target="_blank" underline="hover">
                        CodedThemes
                    </Typography>
                </Typography>

                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 1, ms: 3 }}
                    textAlign={{ xs: 'center', md: 'inherit' }}
                >
                    <Typography
                        variant="subtitle2"
                        color="secondary"
                        component={Link}
                        href="https://material-ui.com/store/contributors/codedthemes/"
                        target="_blank"
                        underline="hover"
                    >
                        MUI Templates
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        color="secondary"
                        component={Link}
                        href="https://codedthemes.com"
                        target="_blank"
                        underline="hover"
                    >
                        Privacy Policy
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        color="secondary"
                        component={Link}
                        href="https://codedthemes.support-hub.io/"
                        target="_blank"
                        underline="hover"
                    >
                        Support
                    </Typography>
                </Stack>
            </Stack>
        </Container>
    );
};

export default AuthFooter;