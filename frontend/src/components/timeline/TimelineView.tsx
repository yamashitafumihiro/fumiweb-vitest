import React from "react";
import {Chrono} from "react-chrono";
import styled from 'styled-components'
import MyTimelineCard from "./MyTimelineCard.tsx";
import {TimelineItem} from "../../data/career.ts";

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`
const MyJourney = styled.h1`
    color: #1e293b;
    font-size: 20px;
`
const Ccbp = styled.span`
    color: #2b237c;
    font-size: 25px;
`
const ChronoContainer = styled.div`
    width: 100%;
    height: 100%;
`

interface TimelineViewProps {
    timelineItemsList: TimelineItem[];
}

const TimelineView: React.FC<TimelineViewProps> = ({timelineItemsList}) => {
    return (
        <MainContainer>
            <MyJourney>
                <Ccbp>職歴</Ccbp>
            </MyJourney>
            <ChronoContainer>
                <Chrono
                    theme={{
                        secondary: 'white',
                    }}
                    mode="VERTICAL_ALTERNATING"
                    items={timelineItemsList}
                    disableToolbar={true}
                >
                    {timelineItemsList.map((item) => {
                        return <MyTimelineCard key={item.id} item={item}/>
                    })}
                </Chrono>
            </ChronoContainer>
        </MainContainer>
    );
};

export default TimelineView;
