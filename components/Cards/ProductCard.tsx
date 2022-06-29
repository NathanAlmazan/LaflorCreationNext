// material
import { Box, Card, Link, Typography, Stack, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
// components
import Label from '../Label';
import { Items } from '../../apollo/items';
// next
import { useRouter } from "next/router";

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

export default function ShopProductCard({ product, selected, handleSelect }: { selected?: boolean, product: Items,  handleSelect?: () => void }) {
  const router = useRouter();
  const { itemName, itemImage, discount, discountCode, itemPrice, itemCode, isAddon } = product;
  
  const handleOrderNow = () => router.push("/order/" + itemCode);

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {discountCode && (
          <Label
            variant="filled"
            color={(discountCode !== null && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {"Sale"}
          </Label>
        )}
        <ProductImgStyle alt={itemName} src={itemImage} />
      </Box>

      <Stack spacing={2} sx={{ p: 2 }}>
        <Link color="inherit" underline="hover">
          <Typography variant="subtitle2" noWrap>
            {itemName}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Button
            disabled={Boolean(selected)}
            variant="contained"
            startIcon={isAddon ? <AddOutlinedIcon /> : <AddShoppingCartRoundedIcon />}
            onClick={Boolean(isAddon && handleSelect) ? handleSelect : handleOrderNow}
          >
            {isAddon ? "Add Item" : "Order Now"}
          </Button>
          <Typography variant="subtitle2">
            <Typography
              component="span"
              variant="body1"
              sx={{
                color: 'text.disabled',
                textDecoration: 'line-through',
              }}
            >
              {discount && "₱ " + itemPrice.toFixed(2)}
            </Typography>
            &nbsp;
            {discount ? "₱ " + (itemPrice - discount.discAmount).toFixed(2) : "₱ " + itemPrice.toFixed(2)}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}