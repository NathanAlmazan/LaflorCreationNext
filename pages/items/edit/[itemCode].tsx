import { useEffect, useState } from "react";
import Head from "next/head";
// mui
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
// components
import PageTitleWrapper from "../../../components/PageTitleWrapper";
import PageHeader from "../../../components/PageHeaders/Header";
import dynamic from "next/dynamic";
// storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseStorage } from "../../../config/firebase/client";

// server
import { GetServerSideProps } from "next";
import client from "../../../apollo";
import { ItemsProps, ItemByCodeProps, ITEM_BY_CODE, Items, Discount, ALL_DISCOUNT, DiscountProps } from "../../../apollo/items";

const CoverCard = dynamic(() => import("../../../components/Cards/CoverCard"));
const CreateItemsForm = dynamic(() => import("../../../components/Forms/CreateItems"))

interface EditItemProps {
    product: Items;
    discounts: Discount[];
}

export default function EditItem({ product, discounts }: EditItemProps) {
  const [itemFile, setItemFile] = useState<File>();
  const [imageSource, setImageSource] = useState<unknown>();

  useEffect(() => {
    if (itemFile) {
      let reader = new FileReader();
      reader.readAsDataURL(itemFile);

      reader.onloadend = (event) => {
        setImageSource([reader.result])
      }
    } else setImageSource(undefined);
  }, [itemFile])

  const handleUploadImage = async (): Promise<string | null> => {
    if (!itemFile) return null;
    const imageRef = ref(firebaseStorage, "items/" + itemFile.name);
    const result = await uploadBytes(imageRef, itemFile);

    return await getDownloadURL(result.ref);
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setItemFile(event.target.files[0]);
    }
  }

  const resetImage = () => setItemFile(undefined);
  
  return (
    <>
      <Head>
        <title>Edit Item | La Flor Creation</title>
      </Head>
      <PageTitleWrapper>
          <PageHeader 
            title="Edit Item"
            subtitle="Edit or delete bouquet or addons."
            back
          />
        </PageTitleWrapper>
      <Container>
        <Grid container spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 5, height: (theme) => theme.spacing(60) }}>
          <Grid item xs={12} md={6}>
            <CoverCard imageSource={imageSource as string} imageLink={product.itemImage} handleImageChange={handleImageChange} />
          </Grid>
          <Grid item xs={12} md={6}>
            <CreateItemsForm item={product} discounts={discounts} uploadImage={handleUploadImage} resetImage={resetImage} />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { query } = ctx;
    try {

      const { data: item } = await client.query<ItemsProps, ItemByCodeProps>({
        query: ITEM_BY_CODE,
        variables: {
          code: query.itemCode as string
        }
      });

      const { data: discounts } = await client.query<DiscountProps>({
        query: ALL_DISCOUNT
      });
    
      if (!item.itemByCode) return {
        notFound: true,
      }
    
      return { 
        props: {
          product: item.itemByCode,
          discounts: discounts.allDiscount
        }
      }
  
    } catch (err) {
      ctx.res.writeHead(302, { Location: '/login' });
      ctx.res.end();
  
      return { props: {} as never };
    }
}