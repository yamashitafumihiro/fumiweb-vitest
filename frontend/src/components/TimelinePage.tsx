import React from "react";
import {useWindowSize} from "../hooks/useWindowSize.tsx";
import {Box} from "@mui/material";

const TimelinePage: React.FC = () => {
    const [width, height] = useWindowSize();
    return (
        <Box sx={{
            margin: 'auto',
            width: width * 0.8,
            maxWidth: '1000px',
            height: height,
            display: 'flex',
            flexDirection: 'column',
            alignItem: 'center'
        }}>
        </Box>
    );
}
export default TimelinePage;