import { useEffect, useState } from "react";
import Head from "next/head";
// mui
import Container from "@mui/material/Container";
// components
import PageTitleWrapper from "../../components/PageTitleWrapper";
import PageHeader from "../../components/PageHeaders/HeaderButton";
import dynamic from "next/dynamic";
//server
import { GetServerSideProps } from "next";
import client from "../../apollo";
import { Rider, GET_ALL_RIDER, DELETE_RIDER } from "../../apollo/riders";
import { useMutation } from "@apollo/client";

const RiderList = dynamic(() => import("../../components/Sections/Riders/RiderList"));
const RiderForm = dynamic(() => import("../../components/Forms/Riders"));

export default function RidersPage({ allRiders }: RiderProps) {
  const [riders, setRiders] = useState<Rider[]>(allRiders);
  const [create, setCreate] = useState<boolean>(false);
  const [update, setUpdate] = useState<Rider | null>(null);

  const handleCreateChange = () => setCreate(!create);

  const handleUpdateRider = (rider: Rider) => setUpdate(rider);

  const handleUPdateClose = () => setUpdate(null);

  const handleAddNewRider = (rider: Rider) => setRiders([ ...riders, rider ]);

  const handleEditRider = (rider: Rider) => {
    let ridersTemp = riders;
    const result = ridersTemp.findIndex(r => r.riderId === rider.riderId);
    ridersTemp[result] = rider;
    setRiders(ridersTemp);
  }

  const [deleteRider, { error }] = useMutation<
    { deleteRider: Rider },
    { rider: number }
  >(DELETE_RIDER);

  const handleDeleteRider = async (riderId: number) => {
    await deleteRider({ variables: { rider: riderId }});
    setRiders(riders.filter(r => r.riderId !== riderId));
  }

  return (
    <>
        <Head>
        <title>Riders | La Flor Creation</title>
        </Head>
        <PageTitleWrapper>
            <PageHeader 
                title="La Flor's Riders"
                subtitle="Create, Edit or Delete riders."
                buttonText="Create Rider"
                buttonClick={handleCreateChange}
            />
        </PageTitleWrapper>
        <Container>
            <RiderList riders={riders} update={handleUpdateRider} remove={handleDeleteRider} />
        </Container>
        <RiderForm open={create} create={handleAddNewRider} handleClose={handleCreateChange} />
        <RiderForm open={update !== null} rider={update} update={handleEditRider} handleClose={handleUPdateClose} />
    </>
  )
}

interface RiderProps {
    allRiders: Rider[];
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    try {
        const { data: riders } = await client.query<RiderProps>({
            query: GET_ALL_RIDER
        });

        if (!riders.allRiders) return {
            notFound: true
        }

        return {
            props: {
                allRiders: riders.allRiders
            }
        }
    } catch (err) {
        ctx.res.writeHead(302, { Location: '/login' });
        ctx.res.end();
    
        return { props: {} as never };
    }
}