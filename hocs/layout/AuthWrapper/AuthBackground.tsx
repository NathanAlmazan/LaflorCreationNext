// material-ui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import Image from "next/image";

// ==============================|| AUTH BLUR BACK SVG ||============================== //

const AuthBackground = () => {
    const theme = useTheme();
    return (
        <Box sx={{ position: 'absolute', filter: 'blur(18px)', zIndex: -1, bottom: 0 }}>
            <Image src="/images/logo.png" alt="logo" width={500} height={500} />
        </Box>
    );
};

export default AuthBackground;