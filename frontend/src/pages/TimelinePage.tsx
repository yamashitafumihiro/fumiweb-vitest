import React from "react";
import {Box} from "@mui/material";
import TimelineView from "../components/timeline/TimelineView.tsx";
import {careerItems} from "../data/career.ts";

const TimelinePage: React.FC = () => {
    return (
        <Box sx={{
            marginX: 'auto',
            maxWidth: '1000px',
            paddingBottom: 4,
            alignItems: 'center',
        }}>
            <TimelineView timelineItemsList={careerItems}/>
        </Box>
    );
};

export default TimelinePage;
