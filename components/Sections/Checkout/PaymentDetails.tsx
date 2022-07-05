import React from 'react';
// mui
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Image from "next/image";
// types
import { CREATE_PAYMENT, OrderPayment, Orders, PaymentType } from '../../../apollo/orders';
import { useMutation } from '@apollo/client';

function PaymentDetails({ orders, next }: { orders: Orders[], next: () => void }) {

  const [createPayment, { error }] = useMutation<
    { createPayment: OrderPayment },
    { orderUid: string[], type: PaymentType }
  >(CREATE_PAYMENT);

  const handleSocialPayment = (type: PaymentType) => {
    createPayment({ variables: {
        orderUid: orders.map(order => order.orderUid),
        type: type
    }}).then(data => data.data && window.location.replace(data.data.createPayment.callbackUrl))
    .catch(err => console.log(err));
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List disablePadding>
        {orders.map(order => {
            const details = order.orderDetails;

            return (
                details.map(item => (
                    <ListItem key={item.itemCode} sx={{ py: 1, px: 0 }}>
                        <ListItemAvatar>
                            <Avatar alt={item.item.itemName} src={item.item.itemImage} />
                        </ListItemAvatar>
                        <ListItemText primary={item.item.itemName} secondary={item.item.isAddon ? "Flower" : "Bouquet"} />
                        <Typography variant="body2">{`₱ ${item.finalPrice.toFixed(2)}`}</Typography>
                    </ListItem>
                ))
            )
        })}
        <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Total" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {"₱ " + orders.map(item => item.amount).reduce((x, y) => x + y, 0).toFixed(2)}
            </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Shipping
          </Typography>
          <Stack direction="column" spacing={2}>
            {orders.map(item => {
                const { recipientName, recipientStreet, recipientCity, recipientProvince } = item.recipient;
                return (
                    <div key={recipientName}>
                        <Typography gutterBottom>{recipientName}</Typography>
                        <Typography gutterBottom>
                            {[recipientStreet, recipientCity, recipientProvince].join(', ')}
                        </Typography>
                    </div>
                )
            })}
          </Stack>
        </Grid>
        <Grid item container direction="column" xs={12} sm={12}>
            <Stack direction="row" spacing={2}>
                <Button fullWidth size="large" color="inherit" variant="outlined" onClick={() => handleSocialPayment('GCASH')}>
                    <Image alt='gcash' src="/images/gcash.png" height={20} width={70} />
                </Button>

                <Button fullWidth size="large" color="inherit" variant="outlined">
                    <Image alt='paymaya' src="/images/paymaya.png" height={20} width={80} />
                </Button>

                <Button fullWidth size="large" color="inherit" variant="outlined" onClick={() => handleSocialPayment('GRAB_PAY')}>
                <Image alt='grabpay' src="/images/grabpay.png" height={20} width={70} />
                </Button>
            </Stack>

            <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
                </Typography>
            </Divider>

            <Button variant="contained" color="primary" onClick={next}>Pay With Card</Button>
        </Grid>
      </Grid>
    </>
  )
}

export default PaymentDetails