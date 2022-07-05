import Box from "@mui/material/Box";

interface DividerProps {
    position: "center" | "flex-start" | "flex-end";
    contrast?: boolean;
}

export default function Divider(props: DividerProps) {
    const { position, contrast } = props;
    
    return (
        <Box sx={{
            display: "flex",
            justifyContent: position
        }}>
            <Box sx={{
                borderBottom: `5px solid ${contrast ? "#FFFF" : "#717999"}`,
                mt: 3,
                mb: 3,
                width: 80
            }} />
        </Box>
    )
}