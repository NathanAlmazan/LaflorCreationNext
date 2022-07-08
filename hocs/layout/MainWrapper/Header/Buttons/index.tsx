import { Box } from '@mui/material';
import HeaderSearch from './Search';
import HeaderNotifications from './Notifications';

function HeaderButtons({ admin }: { admin: boolean }) {
  return (
    <Box sx={{ mr: 1 }}>
      <HeaderSearch />
      {!admin && (
         <Box sx={{ mx: 0.5 }} component="span">
          <HeaderNotifications />
        </Box>
      )}
    </Box>
  );
}

export default HeaderButtons;
