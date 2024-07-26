import React, {useEffect, useState} from "react";
import {Box} from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {useWindowSize} from "../hooks/useWindowSize.tsx";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithubSquare} from '@fortawesome/free-brands-svg-icons'


const AboutPage: React.FC = () => {
    const [markdownContent, setMarkdownContent] = useState("");
    const [width] = useWindowSize();

    useEffect(() => {
        fetch("/aboutMySelf.md")
            .then(response => response.text())
            .then(text => setMarkdownContent(text));
    }, []);

    return (
        <Box sx={{
            marginX: 'auto',
            width: width * 0.8,
            maxWidth: '1000px',
            paddingBottom: 4,
            alignItem: 'center'
        }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
            <a href="https://github.com/yamashitafumihiro">
                <FontAwesomeIcon
                    color="#333"
                    style={{
                        height: 40,
                        width: 40
                    }}
                    icon={faGithubSquare}/>
            </a>

        </Box>
    );
}

export default AboutPage;
