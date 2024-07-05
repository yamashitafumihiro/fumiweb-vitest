import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Box} from '@mui/material';
import {useWindowSize} from '../hooks/useWindowSize.tsx';

const PostPage: React.FC = () => {
    const {postId} = useParams<{ postId: string }>();
    const [markdownContent, setMarkdownContent] = useState("");
    const [width, height] = useWindowSize();

    useEffect(() => {
        fetch(`/posts/${postId}.md`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => setMarkdownContent(text))
            .catch(error => {
                console.error('Error fetching markdown file:', error);
                setMarkdownContent("# Post not found");
            });
    }, [postId]);

    return (
        <Box sx={{
            margin: 'auto',
            width: width * 0.8,
            maxWidth: '1000px',
            height: height,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'left'
        }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
        </Box>
    );
}

export default PostPage;
