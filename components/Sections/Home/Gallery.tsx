import Container from "@mui/material/Grid";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Items } from "../../../apollo/items";

const ProductCard = dynamic(() => import("./ProductCard"));
const Divider = dynamic(() => import("./Divider"));

type ItemsPageProps = {
    items: Items[];
}


export default function GalleryContainer({ items }: ItemsPageProps) {
    const { ref, inView } = useInView();
    const [preview, setPreview] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (inView) setPreview(state => inView);
    }, [inView]);
    
    return (
        <AnimatePresence exitBeforeEnter>
            <Stack direction="column" spacing={8} justifyContent="center" alignItems="center" sx={{ pt: 10, pb: 10, pl: 3, pr: 3, mt: 10 }}>
                <Container maxWidth="sm">
                    {preview && (
                        <motion.div
                            key="text"
                            initial={{ opacity: 0, y: 200 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", duration: 1.5, bounce: 0.3, delay: 0.3 }}
                            exit={{ opacity: 0 }}
                        >
                            <Typography component="div" variant="h2" color="black" align="center">
                                OUR BOUQUETS
                            </Typography>
                            <Divider position="center" />
                            <Typography component="h1" variant="h4" color="secondary" align="center">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi unde impedit, necessitatibus, soluta sit quam minima expedita atque corrupti reiciendis.
                            </Typography>
                        </motion.div>
                    )}
                </Container>
                <Container ref={ref} maxWidth="lg">
                    {preview && (
                        <motion.div
                            key="image"
                            initial={{ opacity: 0, y: 200 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", duration: 2, bounce: 0.3, delay: 0.3 }}
                            exit={{ opacity: 0 }}
                        >
                            <Grid container spacing={2} justifyContent="flex-start" sx={{ maxWidth: "100vw" }}>
                                {items.slice(0, 8).map(product => (
                                    <Grid key={product.itemCode} item xs={12} sm={6} md={4}>
                                        <ProductCard 
                                            title={product.itemName}  
                                            desc={"₱ " + product.itemPrice.toFixed(2)} 
                                            image={product.itemImage}   
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>
                    )}
                </Container>
                {preview && (
                    <motion.div
                        key="image"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        exit={{ opacity: 0 }}
                    >
                        <Button variant="contained" color="primary" size="large" onClick={() => router.push("/items")}>
                            See All Bouquet
                        </Button>
                    </motion.div>
                )}
            </Stack>
        </AnimatePresence>
    )
}