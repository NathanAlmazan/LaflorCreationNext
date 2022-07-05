import Head from "next/head";
// mui
import Container from "@mui/material/Container";
// components
import PageTitleWrapper from "../../components/PageTitleWrapper";
import PageHeader from "../../components/PageHeaders/Header";
import dynamic from "next/dynamic";
//animation
import { AnimatePresence, motion } from "framer-motion";
// server
import { GetServerSideProps } from "next";
import client from "../../apollo";
import { ALL_ITEMS, ItemsProps, Items, ItemsFindVars } from "../../apollo/items";

const ItemsList = dynamic(() => import("../../components/Sections/Items/ItemsList"));

type ItemsPageProps = {
  items: Items[];
}

export default function ItemsPage({ items }: ItemsPageProps) {

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
              <PageHeader 
                title={"La Flor's Bouquets"}
                subtitle="Fresh and aesthetic bouquets for your love ones."
              />
          </PageTitleWrapper>
          <Container>
            <ItemsList items={items} />
          </Container>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { data, error } = await client.query<ItemsProps, ItemsFindVars>({
    query: ALL_ITEMS,
    variables: {
      addons: false
    }
  });

  if (error) return {
    notFound: true,
  }

  return { 
    props: {
      items: data.allItems
    }
  }
}
