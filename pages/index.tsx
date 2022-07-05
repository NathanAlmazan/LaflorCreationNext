import Head from "next/head";
// components
import HeroContainer from "../components/Sections/Home/Hero";
import DescContainer from "../components/Sections/Home/Description";
import GalleryContainer from "../components/Sections/Home/Gallery";
import Testimonials from "../components/Sections/Home/Testimonials";
import Footer from "../components/Sections/Home/Footer";
// server
import { GetStaticProps } from "next";
import client from "../apollo";
import { ALL_ITEMS, ItemsProps, Items, ItemsFindVars } from "../apollo/items";

type HomePageProps = {
  items: Items[];
}

export default function Home({ items }: HomePageProps) {
  return (
    <>
      <Head><title>La Flor Création</title></Head>
      <HeroContainer />
      <DescContainer />
      <GalleryContainer items={items} />
      <Testimonials />
      <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps = async (ctx) => {
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

