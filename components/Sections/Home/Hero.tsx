import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

const covers = ['heroA', 'heroB', 'heroC'];
const banners = ["FRESH BOUQUET AND FLOWERS FOR YOUR LOVE ONES", "FRESH FLOWERS BRING WARM SMILE TO EVERYONE", "CELEBRATE SPECIAL MOMENTS WITH US"]

const StartButton = styled(Button)({
    margin: "40px",
    border: "2px solid white",
    color: "white",
    fontSize: 18,
    width: 180,
    height: 60,
    '&:hover': {
        backgroundColor: "white",
        color: "rgba(0, 0, 0, 0.5)"
    }
})

export default function HeroContainer() {
  const matches = useMediaQuery("(min-width:600px)");
  const [index, setIndex] = useState<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === covers.length - 1 ? 0 : prevIndex + 1
        ),
      5000
    );

    return () => {
      resetTimeout();
    };
  }, [index]);

  return (
    <AnimatePresence exitBeforeEnter>
        <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    height: "90vh",
                    backgroundImage: `url('/covers/${covers[index]}.jpg')`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
            <Box
                sx={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: "black",
                opacity: 0.4
                }}
            />
            <Box
                sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 9,
                padding: 10
                }}
            >
                <Typography
                    component="a"
                    variant={matches ? "h1" : "h2"}
                    align="center"
                    sx={{ maxWidth: matches ? 700 : 500, color: "white" }}
                >
                    {banners[index]}
                </Typography>
                <StartButton variant="outlined" color="inherit" onClick={() => router.push("/items")}>
                    View Bouquets
                </StartButton>
            </Box>
        </Box>
        </motion.div>
    </AnimatePresence>
  );
}
