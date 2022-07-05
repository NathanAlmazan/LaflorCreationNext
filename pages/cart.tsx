import { useEffect, useState } from "react";
// components
import Head from "next/head";
import PageTitleWrapper from "../components/PageTitleWrapper";
import PageHeader from "../components/PageHeaders/Header";
import dynamic from "next/dynamic";
//animation
import { AnimatePresence, motion } from "framer-motion";
// mui
import Container from "@mui/material/Container";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// server
import { GetServerSideProps } from "next";
import client from "../apollo";
import nookies from "nookies";
import { admin } from "../config/firebase/admin";
import { Account, Client } from "../apollo/clients";
import { GET_ORDER_BY_ACCOUNT, Orders } from "../apollo/orders";

const OrdersList = dynamic(() => import("../components/Sections/Cart"));
const Checkout = dynamic(() => import("../components/Sections/Checkout"));

type CardPageProps = {
    account: Account;
    client: Client;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }
  
  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

export default function CardPage({ account, client }: CardPageProps) {
  const [value, setValue] = useState(0);
  const [orders, setOrders] = useState<string[]>([]);
  const [checkOut, setCheckOut] = useState<boolean>(false);
  const [unpaidOrders, setUnpaidOrders] = useState<Orders[]>([]);

  useEffect(() => {
    setUnpaidOrders(state => client.clientOrders.filter(order => order.status === "PND"))
  }, [client])

  const handleSelectOrder = (uid: string) => {
    const selectedIndex = orders.indexOf(uid);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(orders, uid);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(orders.slice(1));
    } else if (selectedIndex === orders.length - 1) {
      newSelected = newSelected.concat(orders.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        orders.slice(0, selectedIndex),
        orders.slice(selectedIndex + 1),
      );
    }

    setOrders(newSelected);
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const removeUnpaidOrder = (uid: string) => {
    setUnpaidOrders(unpaidOrders.filter(order => order.orderUid !== uid));
  }

  return (
    <>
        <Head>
            <title>{"Cart | La Flor Creation"}</title>
        </Head>
        <AnimatePresence>
          {!checkOut ? (
            <motion.div
                key="orders"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <PageTitleWrapper>
                    <PageHeader 
                    title={"Good Day, " + client.clientName}
                    subtitle="You can view your pending orders here."
                    back
                    />
                </PageTitleWrapper>
                <Container maxWidth="md">
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Unplaced Orders" {...a11yProps(0)} />
                                <Tab label="Paid Orders" {...a11yProps(1)} />
                                <Tab label="Delivered Orders" {...a11yProps(2)} />
                            </Tabs>
                        </Box>
                        <TabPanel value={value} index={0}>
                            <OrdersList 
                                selected={orders} 
                                handleSelect={handleSelectOrder} 
                                orders={unpaidOrders} 
                                remove={removeUnpaidOrder}
                            />
                            <Box sx={{ mb: 5 }}>
                                {orders.length !== 0 && (
                                    <Button variant="contained" onClick={() => setCheckOut(true)} fullWidth>Checkout Orders</Button>
                                )}
                            </Box>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <OrdersList orders={client.clientOrders.filter(order => order.status === "PAID")} />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <OrdersList orders={client.clientOrders.filter(order => order.status === "DLV")} />
                        </TabPanel>
                    </Box>
                </Container>
            </motion.div>
          ) : (
            <motion.div
                key="checkoout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <PageTitleWrapper>
                    <PageHeader 
                        title={"Checkout Order"}
                        subtitle="We are accepting various payment methods."
                    />
                </PageTitleWrapper>
                <Checkout 
                    orders={client.clientOrders.filter(order => orders.includes(order.orderUid))} 
                    payment={null} 
                />
            </motion.div>
          )}
        </AnimatePresence>
    </>
  )
}


interface OrderByAccountProps {
    clientByAccount: Client;
}

interface OrderByAccountVars {
    uid: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    try {
        const cookies = nookies.get(ctx);
        const token = await admin.auth().verifyIdToken(cookies.token);
        
        const { uid, email } = token;

        const { data } = await client.query<OrderByAccountProps, OrderByAccountVars>({
            query: GET_ORDER_BY_ACCOUNT,
            variables: {
                uid: uid,
            }
        })
      
        return { 
          props: {
            account: { uid, email },
            client: data.clientByAccount
          }
        }
    
    } catch (err) {
        console.log(err);
        ctx.res.writeHead(302, { Location: '/login' });
        ctx.res.end();

        return { props: {} as never };
    }
}
