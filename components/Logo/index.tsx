import Image from "next/image"
// material-ui
import { ButtonBase, SxProps, Theme } from '@mui/material';


// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ sx }: { sx?: SxProps<Theme> }) => (
    <ButtonBase disableRipple sx={sx}>
        <Image src="/images/logolarge.png" alt="logo" width={200} height={60} />
    </ButtonBase>
);

export default LogoSection;