import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const ProductDiv = styled("div")({
    width: '100%',
    height: 300,
    overflow: 'hidden',
    position: "relative",
    display: "flex",
    justifyContent: "center",
    '& .product-image': {
        objectFit: "cover",
        filter: 'brightness(100%)',
        transition: "transform 2s, filter 1s ease-in-out"
    },
    '& .product-info': {
        display: "flex",
        alignItems: "left",
        justifyContent: "flex-start",
        flexDirection: "column",
        width: "100%",
        height: "45%",
        position: "absolute",
        bottom: 0,
        left: 0,
        zIndex: 9,
        padding: 15, 
        opacity: 0,
        transform: "translateY(60px)",
        transition: "opacity 1.5s, transform 1.5s ease"
    },
    '&:hover .product-image': {
        transform: 'scale(1.5)',
        filter: 'brightness(50%)'
    },
    '&:hover .product-info': {
        transform: "translateY(0px)",
        opacity: 1
    }
})

const ProductMobileDiv = styled("div")({
    width: '100%',
    height: 350,
    overflow: 'hidden',
    position: "relative",
    display: "flex",
    justifyContent: "center",
    '& .product-image': {
        objectFit: "cover"
    },
    '& .product-info': {
        display: "flex",
        alignItems: "left",
        justifyContent: "flex-start",
        flexDirection: "column",
        width: "100%",
        height: "40%",
        position: "absolute",
        bottom: 0,
        left: 0,
        zIndex: 9,
        padding: 15,
        background: "linear-gradient(0deg, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0))"
    },
})

interface ProductProps {
    title: string;
    desc: string;
    image: string;
}

export default function ProductCard(props: ProductProps) {
    const matches = useMediaQuery('(min-width:900px)');
    const { title, desc, image } = props;

    if (!matches) {
        return (
            <ProductMobileDiv>
                <Box 
                    component="img"
                    src={image}
                    className="product-image"
                />
                <Box className="product-info">
                    <Typography component="h1" variant="h4" fontWeight="bold" color="white" sx={{ mb: 1 }}>
                        {title}
                    </Typography>
                    <Typography component="p" variant="subtitle1" color="white">
                        {desc}
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent="flex-end" mt={2}>
                        <Button color="info">Share</Button>
                        <Button color="info">Learn More</Button>
                    </Stack>
                </Box>
            </ProductMobileDiv>
        )
    }

    return (
        <ProductDiv>
            <Box 
                component="img"
                src={image}
                className="product-image"
            />
            <Box className="product-info">
                <Typography component="h1" variant="h4" fontWeight="bold" color="white" sx={{ mb: 1 }}>
                    {title}
                </Typography>
                <Typography component="p" variant="body1" color="white">
                    {desc}
                </Typography>
                <Stack direction="row" spacing={1} justifyContent="flex-end" mt={2}>
                    <Button color="info">Share</Button>
                    <Button color="info">Learn More</Button>
                </Stack>
            </Box>
        </ProductDiv>
    )
}