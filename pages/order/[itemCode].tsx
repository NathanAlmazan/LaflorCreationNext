import { useState } from "react";
import Head from "next/head";
// mui
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
// components
import PageTitleWrapper from "../../components/PageTitleWrapper";
import dynamic from "next/dynamic";
//animation
import { AnimatePresence, motion } from "framer-motion";
// server
import { GetServerSideProps } from "next";
import client from "../../apollo";
import nookies from "nookies";
import { admin } from "../../config/firebase/admin";
import { ALL_ITEMS, ItemsProps, Items, ItemsFindVars, ItemByCodeProps, ITEM_BY_CODE } from "../../apollo/items";
import { Account } from "../../apollo/clients";

const ItemsList = dynamic(() => import("../../components/Sections/Items/ItemsList"));
const OrderCard = dynamic(() => import("../../components/Sections/Items/OrderCard"));
const PageHeaderButton = dynamic(() => import("../../components/PageHeaders/HeaderButton"));
const PageHeader = dynamic(() => import("../../components/PageHeaders/Header"));
const ItemsDrawer = dynamic(() => import("../../components/Sections/Items/ItemsDrawer"));
const OrderForm = dynamic(() => import("../../components/Forms/Order"));

type OrderPageProps = {
  items: Items[];
  account: Account;
  product: Items;
}

interface OrderDetails extends Items {
  quantity: number
}

export default function OrderItemPage({ items, account, product }: OrderPageProps) {
  const matches = useMediaQuery('(min-width:900px)');
  const [selected, setSelected] = useState<OrderDetails[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [placedOrder, setPlacedOrder] = useState<boolean>(false);
  
  const handleDrawerChange = () => setOpen(!open);
  const handleAddSelected = (item: Items) => setSelected([ ...selected, { ...item, quantity: 1 } ]);
  const handleRemoveSelected = (code: string) => setSelected(selected.filter(item => item.itemCode !== code));
  const handleUpdateQuantity = (code: string, quantity: number) => {
    const index = selected.findIndex(item => item.itemCode === code);
    const updated = { ...selected[index], quantity: quantity };
    setSelected([ ...selected.slice(0, index), updated, ...selected.slice(index + 1) ]);
  }
  const handlePlaceOrder = () => setPlacedOrder(!placedOrder);

  return (
    <>
        <Head>
            <title>{"Bouquets & Flowers | La Flor Creation"}</title>
        </Head>
        <AnimatePresence>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
        >
            <PageTitleWrapper>
                {matches ? (
                  <PageHeader 
                    title={product.itemName}
                    subtitle="Customize your bouquet by adding some more flowers."
                    back
                  />
                ) : (
                  <PageHeaderButton 
                    title={product.itemName}
                    subtitle="Customize your bouquet by adding some more flowers."
                    buttonText="Browse Addons"
                    buttonClick={handleDrawerChange}
                  />
                )}
            </PageTitleWrapper>
            <Container>
              <Grid container spacing={4} sx={{ mb: 5 }}>
                <Grid item sm={12} md={12}>
                  <OrderCard 
                    placed={placedOrder}
                    product={product}  
                    selected={selected}
                    update={handleUpdateQuantity}
                    remove={handleRemoveSelected}
                    placeOrder={handlePlaceOrder}
                  />
                </Grid>
                {placedOrder ? (
                  <Grid item md={12} sx={{ flexDirection: "column", mb: 5 }}>
                    <AnimatePresence exitBeforeEnter>
                        <motion.div
                          key="form"
                          initial={{ opacity: 0, y: 200 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 200 }}
                        >
                          <Typography variant="h3" color="primary" sx={{ mb: 2 }}>Recipient Information</Typography>
                          <OrderForm account={account.uid} details={selected} item={{ ...product, quantity: 1 }} />
                        </motion.div>
                    </AnimatePresence>
                  </Grid>
                ) : (
                  <Grid item md={12} sx={{ display: { xs: "none", sm: "none", md: "flex" }, flexDirection: "column", mb: 5 }}>
                    <AnimatePresence exitBeforeEnter>
                        <motion.div
                          key="items"
                          initial={{ opacity: 0, y: 200 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 200 }}
                        >
                          <Typography variant="h3" color="primary" sx={{ mb: 2 }}>Addon Items</Typography>
                          <ItemsList 
                            items={items} 
                            handleSelect={handleAddSelected}
                            selected={selected}
                          />
                        </motion.div>
                    </AnimatePresence>
                  </Grid>
                )}
              </Grid>
            </Container>
        </motion.div>
        </AnimatePresence>
        {!matches && (
          <ItemsDrawer 
            open={open}
            items={items} 
            handleSelect={handleAddSelected}
            handleClose={handleDrawerChange}
            selected={selected}
          />
        )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { query } = ctx;
    try {
      const cookies = nookies.get(ctx);
      const token = await admin.auth().verifyIdToken(cookies.token);
      
      const { uid, email } = token;
  
      const { data: itemsList } = await client.query<ItemsProps, ItemsFindVars>({
        query: ALL_ITEMS,
        variables: {
          addons: true
        }
      });

      const { data: item } = await client.query<ItemsProps, ItemByCodeProps>({
        query: ITEM_BY_CODE,
        variables: {
          code: query.itemCode as string
        }
      });
    
      if (!item.itemByCode) return {
        notFound: true,
      }
    
      return { 
        props: {
          items: itemsList.allItems,
          account: { uid, email },
          product: item.itemByCode
        }
      }
  
    } catch (err) {
      ctx.res.writeHead(302, { Location: '/login' });
      ctx.res.end();
  
      return { props: {} as never };
    }
  }
  
