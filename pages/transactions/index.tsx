import { useState } from "react";
// mui
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
// components
import Head from "next/head";
import PageTitleWrapper from "../../components/PageTitleWrapper";
import PageHeader from "../../components/PageHeaders/Header";
import dynamic from "next/dynamic";
// server
import { GetServerSideProps } from "next";
import client from "../../apollo";
import { Orders, GET_ALL_ORDERS } from "../../apollo/orders";
import { useLazyQuery } from "@apollo/client";

const TransactionList = dynamic(() => import("../../components/Sections/Transactions"));

interface TransactionPageProps {
    allOrders: Orders[];
}

export default function TransactionsPage({ allOrders }: TransactionPageProps) {
  const [orders, setOrders] = useState<Orders[]>(allOrders);

  const [updateOrders, { loading }] = useLazyQuery<TransactionPageProps>(GET_ALL_ORDERS);

  const handleUpdateData = async () => {
    const result = await updateOrders();
    if (result.data) {
        setOrders(result.data.allOrders);
    }
  }

  return (
    <>
    <Head>
      <title>Orders | La Flor Creation</title>
    </Head>
    <PageTitleWrapper>
        <PageHeader 
          title="La Flor's Orders"
          subtitle="Manage all recurring orders."
        />
      </PageTitleWrapper>
    <Container sx={{ mb: 6 }}>
        <TransactionList clientOrders={orders} update={handleUpdateData} />
    </Container>
  </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    try {
        const { data } = await client.query<TransactionPageProps>({
            query: GET_ALL_ORDERS
        });

        return {
            props: {
                allOrders: data.allOrders
            }
        }
    } catch (err) {
        ctx.res.writeHead(302, { Location: '/login' });
        ctx.res.end();
    
        return { props: {} as never };
    }
}