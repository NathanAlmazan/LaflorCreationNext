import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import Divider from "./Divider";

const ParallaxBox = styled(Box)({
    backgroundImage: "url('/covers/parallax.jpg')",
    minHeight: 500,
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
});

export default function Testimonials() {
    const { ref, inView } = useInView();
    const [preview, setPreview] = useState<boolean>(false);

    useEffect(() => {
        if (inView) setPreview(state => inView);
    }, [inView]);

    return (
        <AnimatePresence exitBeforeEnter>
            <ParallaxBox>
                <Stack direction="column" spacing={8} justifyContent="center" alignItems="center" pt={10}>
                    {preview && (
                        <motion.div
                            key="title"
                            initial={{ opacity: 0, y: 200 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", duration: 1.5, bounce: 0.3, delay: 0.3 }}
                            exit={{ opacity: 0 }}
                        >
                            <Container maxWidth="sm">
                                <Typography component="div" variant="h2" color="white" align="center">
                                    HAPPY CUSTOMER SAYS
                                </Typography>
                                <Divider position="center" contrast={true} />
                            </Container>    
                        </motion.div>
                    )}
                    <Container ref={ref} maxWidth="lg">
                        <Grid container spacing={4} mb={10}>
                            <Grid item xs={12} sm={6} md={4}>
                                {preview && (
                                    <motion.div
                                        key="title"
                                        initial={{ opacity: 0, y: 200 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ type: "spring", duration: 1.5, bounce: 0.3, delay: 0.5 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <Stack direction="column" spacing={2} justifyContent="center" alignItems="center">
                                            <Avatar 
                                                alt="Profile"
                                                src="/feedback/profile_1.jpg"
                                                sx={{ width: 100, height: 100 }}
                                            />
                                            <Stack direction="row" spacing={1}>
                                                <Typography component="div" variant="h4" color="white" align="center">
                                                    Jane Doe,
                                                </Typography>
                                                <Typography component="div" variant="h4" color="primary.light" align="center">
                                                    XYZ Company
                                                </Typography>
                                            </Stack>
                                            <Typography component="div" variant="body2" color="white" align="center" sx={{ width: "100%", fontStyle: "italic" }}>
                                                {`"Duis deserunt aute dolor aliquip tempor Lorem ad. Dolore cillum mollit qui do occaecat amet incididunt proident aliquip incididunt consectetur."`}
                                            </Typography>
                                        </Stack>
                                    </motion.div>
                                )}
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                {preview && (
                                    <motion.div
                                        key="title"
                                        initial={{ opacity: 0, y: 200 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ type: "spring", duration: 1.5, bounce: 0.3, delay: 0.7 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <Stack direction="column" spacing={2} justifyContent="center" alignItems="center">
                                            <Avatar 
                                                alt="Profile"
                                                src="/feedback/profile_2.jpg"
                                                sx={{ width: 100, height: 100 }}
                                            />
                                            <Stack direction="row" spacing={1}>
                                                <Typography component="div" variant="h4" color="white" align="center">
                                                    John Doe,
                                                </Typography>
                                                <Typography component="div" variant="h4" color="primary.light" align="center">
                                                    ABC Company
                                                </Typography>
                                            </Stack>
                                            <Typography component="div" variant="body2" color="white" align="center" sx={{ width: "100%", fontStyle: "italic" }}>
                                                {`"Id elit non dolore et quis cupidatat ullamco elit nostrud. Deserunt esse consectetur sunt ipsum cupidatat aliquip laboris eu eiusmod do ex magna quis."`}
                                            </Typography>
                                        </Stack>
                                    </motion.div>
                                )}
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                {preview && (
                                    <motion.div
                                        key="title"
                                        initial={{ opacity: 0, y: 200 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ type: "spring", duration: 1.5, bounce: 0.3, delay: 1.0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <Stack direction="column" spacing={2} justifyContent="center" alignItems="center">
                                            <Avatar 
                                                alt="Profile"
                                                src="/feedback/profile_1.jpg"
                                                sx={{ width: 100, height: 100 }}
                                            />
                                            <Stack direction="row" spacing={1}>
                                                <Typography component="div" variant="h4" color="white" align="center">
                                                    Jane Doe,
                                                </Typography>
                                                <Typography component="div" variant="h4" color="primary.light" align="center">
                                                    XYZ Company
                                                </Typography>
                                            </Stack>
                                            <Typography component="div" variant="body2" color="white" align="center" sx={{ width: "100%", fontStyle: "italic" }}>
                                                {`"Duis deserunt aute dolor aliquip tempor Lorem ad. Dolore cillum mollit qui do occaecat amet incididunt proident aliquip incididunt consectetur."`}
                                            </Typography>
                                        </Stack>
                                    </motion.div>
                                )}
                            </Grid>
                        </Grid>
                    </Container>
                </Stack>
            </ParallaxBox>
        </AnimatePresence>
    )
}