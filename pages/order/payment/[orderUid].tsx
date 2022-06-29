// server
import { GetServerSideProps } from "next";
import client from "../../../apollo";
import nookies from "nookies";
import { admin } from "../../../config/firebase/admin";
import { Account } from "../../../apollo/clients";
import { GetOrderVars, GET_ORDER_BY_UID, Orders } from "../../../apollo/orders";

type OrderPaymentPageProps = {
    order: Orders;
    account: Account;
}

interface GetOrdersResult {
    orderById: Orders
}

export default function OrderPaymentPage({ order, account }: OrderPaymentPageProps) {
  return (
    <div>
        <h1>{order.amount}</h1>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { query } = ctx;

    try {
        const cookies = nookies.get(ctx);
        const token = await admin.auth().verifyIdToken(cookies.token);
        
        const { uid, email } = token;
    
        const { data, error } = await client.query<GetOrdersResult, GetOrderVars>({
          query: GET_ORDER_BY_UID,
          variables: {
            orderUid: query.orderUid as string
          }
        });

        if (!data.orderById) return {
            notFound: true
        }
      
        return { 
          props: {
            account: { uid, email },
            order: data.orderById
          }
        }
    
    } catch (err) {
        console.log(err);
        ctx.res.writeHead(302, { Location: '/login' });
        ctx.res.end();

        return { props: {} as never };
    }
}