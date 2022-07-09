// components
import Head from "next/head";
import PageTitleWrapper from "../../components/PageTitleWrapper";
import PageHeader from "../../components/PageHeaders/Header";
import dynamic from "next/dynamic";
// mui
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material";
//animation
import { AnimatePresence, motion } from "framer-motion";
// server
import { GetStaticProps } from "next";
import client from "../../apollo";
import { 
    GET_PROVINCE_RANK, 
    GET_DAILY_ORDERS, 
    GET_ITEMS_SALES,
    RankItemSales,
    DailyOrders,
    RankProvinces
} from "../../apollo/admin";
import { useAuth } from "../../hocs/providers/AuthProvider";
import { capitalCase } from "change-case";

const ProvinceChart = dynamic(() => import("../../components/Charts/Provinces"), { ssr: false });
const SalesChart = dynamic(() => import("../../components/Charts/Sales"), { ssr: false });
const TopItemsChart = dynamic(() => import("../../components/Charts/TopItems"), {  ssr: false });

interface AdminDashboardProps {
    sales: RankItemSales[],
    orders: DailyOrders[],
    provinces: RankProvinces[]
}

export default function AdminDashboard({ sales, orders, provinces }: AdminDashboardProps) {
  const theme = useTheme();
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
                        title={"Admin Dashboard"}
                        subtitle="Monitor your business activities here."
                    />
                </PageTitleWrapper>
                <Container>
                    <Grid container spacing={2} sx={{ mb: 5 }}>
                        <Grid item xs={12} sm={12}>
                            <SalesChart 
                                title="Order Counts"
                                subheader="Shows number of orders daily."
                                chartLabels={orders.map(s => s.deliveryDate)}
                                chartData={[
                                    {
                                      name: new Date().getFullYear().toString(),
                                      type: 'area',
                                      fill: 'gradient',
                                      data: orders.map(s => s.orderCount)
                                    }
                                  ]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <TopItemsChart 
                                title="Top Selling"
                                subheader="Top 10 selling items."
                                chartData={sales.map(s => ({ label: s.itemCode, value: s.itemSales }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <ProvinceChart 
                                title="Top Provinces"
                                subheader="Most profitable areas."
                                chartLabels={provinces.map(p => p.province)}
                                chartData={[
                                    { name: 'Series 1', data: provinces.map(p => p.orderCount) }
                                ]}
                                chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </motion.div>
        </AnimatePresence>
    </>
  )
}

interface RankItemSalesProps {
    rankItemSales: RankItemSales[];
}

interface DailyOrdersProps {
    dailyOrders: DailyOrders[];
}

interface RankProvincesProps {
    rankProvinces: RankProvinces[];
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    try {

        const { data: sales } = await client.query<RankItemSalesProps>({
            query: GET_ITEMS_SALES
        })

        const { data: orders } = await client.query<DailyOrdersProps>({
            query: GET_DAILY_ORDERS
        })

        const { data: provinces } = await client.query<RankProvincesProps>({
            query: GET_PROVINCE_RANK
        })

        return {
            props: {
                sales: sales.rankItemSales,
                orders: orders.dailyOrders,
                provinces: provinces.rankProvinces
            },
            revalidate: 5
        }
    } catch (err) {
        console.log((err as Error).message);
        return { props: {} as never };
    }
}