import {AiFillCalendar} from 'react-icons/ai'
import React from "react";
import {
    ProjectContainer,
    TopContainer,
    TopHeading,
    Description,
    IconContainer,
    Duration,
    TagList,
    ListPara,
    ListItem
} from './StyledComponents'


interface TimelineItem {
    id: string;
    title: string;
    description: string;
    duration: string;
    status: string;
    projectTitle?: string;
    projectUrl?: string;
    tagList?: { id: string; name: string }[];
}

interface MyTimelineCardProps {
    item: TimelineItem;
}

const MyTimelineCard: React.FC<MyTimelineCardProps> = ({item}) => {
    const {projectTitle, description, duration, status, tagList} = item;
    return (
        <ProjectContainer>
            <TopContainer>
                <TopHeading>{projectTitle}</TopHeading>
                <IconContainer>
                    <AiFillCalendar/>
                    <Duration>{duration}</Duration>
                </IconContainer>
            </TopContainer>
            <>{status}</>
            <Description>{description}</Description>
            <TagList>
                {tagList?.map(eachValue => (
                    <ListItem key={eachValue.id}>
                        <ListPara>{eachValue.name}</ListPara>
                    </ListItem>
                ))}
            </TagList>
        </ProjectContainer>
    );
};

export default MyTimelineCard;