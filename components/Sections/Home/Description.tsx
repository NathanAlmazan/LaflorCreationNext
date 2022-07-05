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
            <Box sx={{ backgroundColor: "#f8f9fa", pt: 15, pb: 15 }}>
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
                                            The company was established in 2020 in Caloocan City to supply foundation, ground engineering, and construction equipment along with contractors operating here in the Philippines.
                                        </Typography>
                                        <Typography component="p" variant="body1" lineHeight={1.5} mb={4}>
                                            Our products include a vibratory hammer, hydraulic breaker, vibratory ripper, quick coupler, stone grapple, hydraulic compactor, and other various excavator attachments. We are also serving special products such as steel sheet piles, fabricated steel pipes or casings, drilling buckets, drilling augers, tremie pipe, bentonite mixer, and powder.
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