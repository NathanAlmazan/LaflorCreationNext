// components
import Head from "next/head";
import PageTitleWrapper from "../../../components/PageTitleWrapper";
import PageHeader from "../../../components/PageHeaders/Header";
import dynamic from "next/dynamic";
//animation
import { AnimatePresence, motion } from "framer-motion";
// server
import { GetServerSideProps } from "next";
import client from "../../../apollo";
import nookies from "nookies";
import { admin } from "../../../config/firebase/admin";
import { Account } from "../../../apollo/clients";
import { CONFIRM_PAYMENT, GetOrderVars, GET_ORDER_BY_UID, OrderPayment, Orders } from "../../../apollo/orders";

const Checkout = dynamic(() => import("../../../components/Sections/Checkout"));

type OrderPaymentPageProps = {
    orders: Orders[];
    account: Account;
    payment: string | null;
}

interface GetOrdersResult {
    orderById: Orders
}

interface OrderPaymentResult {
  confirmPayment: OrderPayment;
}

export default function OrderPaymentPage({ orders, account, payment }: OrderPaymentPageProps) {

  return (
    <>
        <Head>
          <title>{"Checkout Order | La Flor Creation"}</title>
        </Head>
        <AnimatePresence>
          <motion.div
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
            <Checkout orders={orders} payment={payment} />
          </motion.div>
        </AnimatePresence>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { query } = ctx;

    try {
        const cookies = nookies.get(ctx);
        const token = await admin.auth().verifyIdToken(cookies.token);
        
        const { uid, email } = token;
    
        const { data } = await client.query<GetOrdersResult, GetOrderVars>({
          query: GET_ORDER_BY_UID,
          variables: {
            orderUid: query.orderUid as string
          }
        });

        if (!data.orderById) return {
            notFound: true
        }

        const order: Orders = data.orderById;
      
        return { 
          props: {
            account: { uid, email },
            orders: [order],
            payment:  order.paymentId
          }
        }
    
    } catch (err) {
        console.log(err);
        ctx.res.writeHead(302, { Location: '/login' });
        ctx.res.end();

        return { props: {} as never };
    }
}