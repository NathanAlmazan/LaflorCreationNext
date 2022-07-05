import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Image from "next/image";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import { styled } from '@mui/material/styles';
// types
import { DELETE_ORDER, Orders } from "../../../apollo/orders";
import { useMutation } from "@apollo/client";
// animations
import { AnimatePresence, motion } from "framer-motion";

const ProductImgStyle = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
});

type OrderListProps = {
    orders: Orders[];
    selected?: string[];
    handleSelect?: (uid: string) => void;
    remove?: (uid: string) => void;
}

function OrderList({ orders, selected, handleSelect, remove }: OrderListProps) {

  const [deleteOrder, { data }] = useMutation<
    { deleteOrder: Orders },
    { orderUid: string }
  >(DELETE_ORDER);

  const deleteUnpaidOrder = async(uid: string) => {
    await deleteOrder({ variables: {
        orderUid: uid
    }});

    if (remove) remove(uid);
  }

  return (
    <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
        <AnimatePresence>
            {orders.map(order => {
                const flowers = order.orderDetails.filter(item => item.item.isAddon);
                const bouquet = order.orderDetails.filter(item => !item.item.isAddon);
                const mainBouquet = bouquet[0];

                const { recipientName, recipientStreet, recipientCity, recipientProvince } = order.recipient;
                
                return (
                <motion.div
                    key={order.orderUid}
                    initial={{ x: -200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 200, opacity: 0 }}
                    style={{ margin: 10 }}
                >
                <Card sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={5} sx={{ display: 'flex', flexDirection: 'column' }}>
                            {mainBouquet && (
                                <>
                                    <Box sx={{ pt: '100%', position: 'relative' }}>
                                        <ProductImgStyle
                                            alt={mainBouquet.item.itemName}
                                            src={mainBouquet.item.itemImage} 
                                        />
                                    </Box>
                                    <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 1 }}>
                                        <Link color="inherit" underline="hover">
                                            <Typography variant="subtitle2" noWrap>
                                                {mainBouquet.item.itemName}
                                            </Typography>
                                        </Link>
                                        <Typography variant="subtitle1">
                                            {"₱ " + mainBouquet.finalPrice.toFixed(2)}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" sx={{ mt: 1 }}>
                                        <Typography variant="h5" align="right" sx={{ width: "100%" }}>
                                            {"Total: ₱ " + order.amount.toFixed(2)}
                                        </Typography>
                                    </Stack>
                                </>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={7} sx={{ position: "relative" }}>
                            <Stack direction="row">
                                <Stack direction="row" spacing={2} sx={{ border: "1px dashed red", p: 1, mb: 2, width: "100%" }}>
                                    <Typography variant="h5">{"Recipient"}</Typography>
                                    <div>
                                        <Typography variant="body1">{recipientName}</Typography>
                                        <Typography variant="body1">
                                            {[recipientStreet, recipientCity, recipientProvince].join(', ')}
                                        </Typography>
                                    </div>
                                </Stack>
                            </Stack>
                        <Stack direction="column" spacing={2}>
                        {flowers.map(item => (
                                <Box key={item.itemCode} sx={{ display: 'flex' }}>
                                    <Image
                                        src={item.item.itemImage}
                                        alt={item.item.itemName}
                                        width={80}
                                        height={80}
                                    />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
                                        <Typography component="div" variant="h5">
                                            {item.item.itemName + "  x" + item.quantity}
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary" component="div">
                                            {"₱ " + item.finalPrice.toFixed(2)}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                        {selected && handleSelect && (
                            <Stack direction="row" spacing={2} sx={{ position: "absolute", right: 0, bottom: 0, width: "95%" }}>
                                <Button variant="contained" onClick={() => handleSelect(order.orderUid)} fullWidth>
                                    {selected.includes(order.orderUid) ? "Unplace Order" : "Place Order"}
                                </Button>
                                <Button variant="outlined" onClick={() => deleteUnpaidOrder(order.orderUid)} fullWidth>
                                    Remove Order
                                </Button>
                            </Stack>
                        )}
                        </Grid>
                    </Grid>
                </Card>
                </motion.div>
            )})}
        </AnimatePresence>
        {orders.length === 0 && (
            <Stack direction="column">
                <Image 
                    src="/images/noorders.png"
                    alt="Empty Orders"
                    width={500}
                    height={500}
                />
                <Typography align="center" variant="h4">No Orders yet. Please refer to the items page to make your first order.</Typography>
            </Stack>
        )}
    </Stack>
  )
}

export default OrderList