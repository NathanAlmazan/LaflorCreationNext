import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from 'react-intersection-observer';

//components
import Divider from "./Divider";
import { useEffect, useState } from "react";

export default function DescriptionContainer() {
    const { ref, inView } = useInView();
    const [preview, setPreview] = useState<boolean>(false);

    useEffect(() => {
        if (inView) setPreview(state => inView);
    }, [inView]);
    
    return (
        <AnimatePresence exitBeforeEnter>
            <Box sx={{ pt: 15, pb: 15 }}>
                <Container>
                    <Grid 
                        container 
                        ref={ref}
                        spacing={2} 
                        justifyContent="center" 
                        alignItems="center" 
                    >
                        <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
                            {preview && (
                                <motion.div
                                    key="text"
                                    initial={{ opacity: 0, y: 200 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ type: "spring", duration: 2, bounce: 0.3, delay: 0.3 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Box sx={{ paddingRight: 5 }}>
                                        <Typography component="h1" variant="h2" color="black">
                                            La Flor Création 
                                        </Typography>
                                        <Divider position="flex-start" />
                                        <Typography component="p" variant="body1" lineHeight={1.5} mb={2}>
                                            Propelled by our affection for flowers and energy about nature, it is our obsession to make creative and noteworthy plant and new flower courses of action. We trust that the best, freshest flowers deliver the most noteworthy presentations.
                                        </Typography>
                                        <Typography component="p" variant="body1" lineHeight={1.5} mb={4}>
                                            La Flor Creation is glad to give quality flowers to our customers. Our retail premises opened in 2012 and we owe quite a bit of our prosperity to our extraordinary customers who move us to make unique and dazzling arrangements until today. Our master staff is here to enable all customers to pick the best flowers and plants for all events and purposes.
                                        </Typography>
                                        <Button variant="contained" color="primary" size="large">Learn More</Button>
                                    </Box>
                                </motion.div>
                            )}
                        </Grid>
                        <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
                            {preview && (
                                <motion.div
                                    key="image"
                                    initial={{ opacity: 0, y: 200 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ type: "spring", duration: 1.5, bounce: 0.3, delay: 0.3 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Box 
                                        component="img"
                                        alt="desc image"
                                        src="/covers/desc.jpg"
                                        sx={{
                                            width: "100%",
                                            height: 500,
                                            objectFit: "cover",
                                            objectPosition: "center",
                                            overflow: "hidden"
                                        }}
                                    />
                                </motion.div>
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </AnimatePresence>
    )
}