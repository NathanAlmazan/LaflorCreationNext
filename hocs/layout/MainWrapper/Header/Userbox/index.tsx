import { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  lighten,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
  Stack
} from '@mui/material';

import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import { useAuth } from '../../../../providers/AuthProvider';
import { firebaseAuth } from "../../../../../config/firebase/client"
import { signOut } from "firebase/auth";
import { useRouter } from 'next/router';
import { capitalCase } from 'change-case';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

type UserBox = {
  name: string,
  avatar: string,
  email: string
};

function HeaderUserbox() {
  const { user } = useAuth();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserBox>({
    avatar: '',
    email: '',
    name: ''
  });
  const { avatar, email, name } = userInfo;

  useEffect(() => {
    if (user) {
      setUserInfo(state => ({
        avatar: user.photoURL as string,
        email: `${(user.email as string).slice(0, 20)}...`,
        name: user.displayName as string
      }))
    }
  }, [user])

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const logOut = async () => {
    await signOut(firebaseAuth);
    router.push("/login");

  }

  return (
    <>
      {user ? (
        <>
          <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
            <Avatar variant="rounded" alt={name} src={avatar} />
            <Hidden mdDown>
              <UserBoxText>
                <UserBoxLabel variant="body1">{capitalCase(name)}</UserBoxLabel>
                <UserBoxDescription variant="body2">
                  {email}
                </UserBoxDescription>
              </UserBoxText>
            </Hidden>
            <Hidden smDown>
              <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
            </Hidden>
          </UserBoxButton>
          <Popover
            anchorEl={ref.current}
            onClose={handleClose}
            open={isOpen}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <MenuUserBox sx={{ minWidth: 210 }} display="flex">
              <Avatar variant="rounded" alt={name} src={avatar} />
              <UserBoxText>
                <UserBoxLabel variant="body1">{name}</UserBoxLabel>
                <UserBoxDescription variant="body2">
                  {email}
                </UserBoxDescription>
              </UserBoxText>
            </MenuUserBox>
            <Divider sx={{ mb: 0 }} />
            <List sx={{ p: 1 }} component="nav">
              <ListItem button>
                <AccountBoxTwoToneIcon fontSize="small" />
                <ListItemText primary="My Profile" />
              </ListItem>
              <ListItem
                button
              >
                <AccountTreeTwoToneIcon fontSize="small" />
                <ListItemText primary="Account Settings" />
              </ListItem>
            </List>
            <Divider />
            <Box sx={{ m: 1 }}>
              <Button color="primary" onClick={logOut} fullWidth>
                <LockOpenTwoToneIcon sx={{ mr: 1 }} />
                Sign out
              </Button>
            </Box>
          </Popover>
        </>
      ) : (
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" size="large" onClick={() => router.push("/login")}>Login</Button>
          <Button variant="contained" size="large" onClick={() => router.push("/register")}>Register</Button>
        </Stack>
      )}
    </>
  );
}

export default HeaderUserbox;
