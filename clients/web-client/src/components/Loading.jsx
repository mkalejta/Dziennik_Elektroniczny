import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
        </Box>
    );
}