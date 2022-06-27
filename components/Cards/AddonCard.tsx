import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Items } from '../../apollo/items';

interface OrderDetails extends Items {
    quantity: number
  }

export default function AddonCard({ product, remove, update }: { product: OrderDetails, remove: () => void, update: (code: string, quantity: number) => void }) {
  const { itemName, discount, itemPrice, itemImage, quantity, itemCode } = product;

  return (
    <Card sx={{ display: 'flex', width: '100%', height: 130, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex' }}>
            <CardMedia
                component="img"
                sx={{ width: 151 }}
                image={itemImage}
                alt={itemName}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="div" variant="h5">
                    {itemName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component="div">
                    {discount ? "₱ " + (itemPrice - discount.discAmount).toFixed(2) : "₱ " + itemPrice.toFixed(2)}
                </Typography>
                </CardContent>
            </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
            <IconButton aria-label="previous" onClick={remove}>
                <CloseRoundedIcon color="primary" />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1, mt: 4 }}>
                <IconButton aria-label="add" onClick={() => update(itemCode, quantity+1)}>
                    <AddCircleRoundedIcon color="primary" />
                </IconButton>
                <Typography variant="subtitle2" sx={{ mr: 2, ml: 2 }}>{quantity}</Typography>
                <IconButton aria-label="minus"  onClick={Boolean(quantity-1 === 0) ? remove : () => update(itemCode, quantity-1)}>
                    <RemoveCircleRoundedIcon color="primary" />
                </IconButton>
            </Box>
        </Box>
    </Card>
  );
}
