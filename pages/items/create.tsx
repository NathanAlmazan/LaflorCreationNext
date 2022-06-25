import { useEffect, useState } from "react";
import Head from "next/head";
// mui
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
// components
import PageTitleWrapper from "../../components/PageTitleWrapper";
import PageHeader from "../../components/PageHeaders/Header";
import dynamic from "next/dynamic";
// ssr
import { GetStaticProps } from "next";
import client from "../../apollo";
import { DiscountProps, Discount, ALL_DISCOUNT } from "../../apollo/items";
// storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseStorage } from "../../config/firebase/client";

const CoverCard = dynamic(() => import("../../components/Cards/CoverCard"));
const CreateItemsForm = dynamic(() => import("../../components/Forms/CreateItems"))


type CreateItemProps = {
  discounts: Discount[];
}

export default function CreateItemsPage({ discounts }: CreateItemProps) {
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
        <title>Create Item</title>
      </Head>
      <PageTitleWrapper>
          <PageHeader 
            title="Create Item"
            subtitle="Create new bouquet or addons."
            back
          />
        </PageTitleWrapper>
      <Container>
        <Grid container spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 5, height: (theme) => theme.spacing(60) }}>
          <Grid item xs={12} md={6}>
            <CoverCard imageSource={imageSource as string} handleImageChange={handleImageChange} />
          </Grid>
          <Grid item xs={12} md={6}>
            <CreateItemsForm discounts={discounts} uploadImage={handleUploadImage} resetImage={resetImage} />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { data, error } = await client.query<DiscountProps>({
    query: ALL_DISCOUNT
  });

  if (error) return {
    notFound: true,
  }

  return { 
    props: {
      discounts: data.allDiscount
    },
    revalidate: 10
  }
}