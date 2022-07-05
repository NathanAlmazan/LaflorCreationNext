import {
  alpha,
  Badge,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useRouter } from "next/router";
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import { styled } from '@mui/material/styles';

import { useQuery } from '@apollo/client';
import { Client } from '../../../../../../apollo/clients';
import { GET_ORDER_COUNT } from '../../../../../../apollo/orders';
import { useAuth } from '../../../../../providers/AuthProvider';
import { useEffect, useState } from 'react';

const NotificationsBadge = styled(Badge)(
  ({ theme }) => `
    
    .MuiBadge-badge {
        background-color: ${alpha(theme.palette.error.main, 0.1)};
        color: ${theme.palette.error.main};
        min-width: 16px; 
        height: 16px;
        padding: 0;

        &::after {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            box-shadow: 0 0 0 1px ${alpha(theme.palette.error.main, 0.3)};
            content: "";
        }
    }
`
);

interface OrderByAccountVars {
  uid: string;
}

function HeaderNotifications() {
  const { user } = useAuth();
  const router = useRouter();
  const [unpaidOrders, setUnpaidOrders] = useState<number>(0);

  const { data, error } = useQuery<Client, OrderByAccountVars>(
    GET_ORDER_COUNT,
    {variables: {
      uid: user?.uid as string
    },
    skip: user === null
    }
  );

  useEffect(() => {
    if (data) {
      setUnpaidOrders(state => data.orderCount);
    } else console.log(error);
  }, [data, error]);

  return (
      <Tooltip arrow title="View Cart">
        <IconButton color="primary" disabled={user === null} onClick={() => router.push('/cart')}>
          <NotificationsBadge
            badgeContent={unpaidOrders}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <ShoppingCartTwoToneIcon />
          </NotificationsBadge>
        </IconButton>
      </Tooltip>
  );
}

export default HeaderNotifications;
