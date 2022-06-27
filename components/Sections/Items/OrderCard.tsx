// material
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Items } from '../../../apollo/items';
// next
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const AddonList = dynamic(() => import("./AddonList"));

// ----------------------------------------------------------------------

interface OrderDetails extends Items {
  quantity: number
}

type OrderCardProps =  { 
  placed: boolean,
  product: Items, 
  selected: OrderDetails[],
  remove: (code: string) => void,
  update: (code: string, quantity: number) => void, 
  placeOrder: () => void
}

export default function ShopProductCard({ product, selected, placed, placeOrder, remove, update }: OrderCardProps) {
  const router = useRouter();
  const { itemName, itemImage, discount, itemPrice } = product;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={6}>
        <Card sx={{ height: 500 }}>
          <CardMedia
            component="img"
            height="400"
            image={itemImage}
            alt={itemName}
          />
            <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ p: 3 }}>
                <Link color="inherit" underline="hover">
                    <Typography variant="subtitle2" noWrap>
                        {itemName}
                    </Typography>
                </Link>
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
        </Card>
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Stack direction="column" spacing={2}>
          {selected.length === 0 ? (
            <Stack 
              direction="column" 
              justifyContent="center" 
              alignItems="center" 
              spacing={2} 
              sx={{ 
                height: 420,
                border: "2px dashed red"
              }}
            >
              <CategoryOutlinedIcon color="primary" sx={{ height: 70, width: 70 }} />
              <Typography variant="h4" color="primary">
                Addon items will show here.
              </Typography>
            </Stack>
          ) : (
            <Box sx={{
              width: "100%",
              height: 420,
              overflowY: "scroll",
              overflowX: "hidden",
              '&::-webkit-scrollbar': {
                width: 8,
                height: 8
              },
              '&::-webkit-scrollbar-track': {
                  backgroundColor: "#dfdfdf",
                  borderRadius: 10
              },
              '&::-webkit-scrollbar-thumb': {
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  borderRadius: 10
              }
            }}>
              <AddonList selected={selected} update={update} remove={remove} />
            </Box>
          )}
          {!placed ? (
            <Stack direction="row" spacing={2}>
              <Button variant="contained" size="large" onClick={placeOrder} fullWidth>Place Order</Button>
              <Button variant="outlined" size="large" fullWidth>Add to Cart</Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2} display={{ sm: "none", md: "flex" }}>
              <Button 
                variant="contained" 
                size="large"  
                onClick={placeOrder} 
                startIcon={<ArrowBackIcon />}
                fullWidth
              >
                  Choose Addon
                </Button>
            </Stack>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}
