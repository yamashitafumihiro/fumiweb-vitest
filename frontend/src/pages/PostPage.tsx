import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import ReactMarkdown, {Components} from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Box, Card, CardContent, Typography} from '@mui/material';
import {useWindowSize} from '../hooks/useWindowSize.tsx';
import {blogposts} from "./HomePage.tsx";
import remarkParse from "remark-parse";
import {unified} from 'unified';
import {visit} from "unist-util-visit";
import rehypeRaw from "rehype-raw";
import LikesButton from './LikesButton.tsx';

const PostPage: React.FC = () => {
    const {postId:slug} = useParams<{ postId: string }>();
    const [markdownContent, setMarkdownContent] = useState("");
    const [headings, setHeadings] = useState<{ level: number, text: string } []>([]);
    const [width] = useWindowSize();

    const post = blogposts.find(post => post.slug === slug);
    const post_id = post?.id.toString();

    if (!slug || !post) {
        return <div>Page not found</div>;
    }

    useEffect(() => {
        fetch(`/posts/${slug}.md`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                setMarkdownContent(text);
                extractHeadings(text);
            })
            .catch(error => {
                console.error('Error fetching markdown file:', error);
                setMarkdownContent("# Post not found");
            });
    }, [slug]);

    const extractHeadings = (markdown: string) => {
        const tree = unified().use(remarkParse).parse(markdown);
        const newHeadings: { level: number, text: string }[] = [];

        visit(tree, 'heading', (node) => {
            if (node.type === 'heading') {
                const text = node.children
                    .filter((child): child is { type: 'text'; value: string } => child.type === 'text')
                    .map((child) => child.value)
                    .join('');
                newHeadings.push({level: node.depth, text});
            }
        });

        setHeadings(newHeadings);
    };

    const components: Components = {
        h1: ({...props}) => (
            <h1 style={{textAlign: 'center'}} {...props} />
        ),
        h2: ({...props}) => (
            <h2 style={{textAlign: 'left'}} {...props} />
        ),
        p: ({...props}) => (
            <p style={{textAlign: 'left'}} {...props} />
        ),
        ul: ({...props}) => (
            <ul style={{textAlign: 'left'}} {...props} />
        ),
        li: ({...props}) => (
            <li style={{textAlign: 'left'}} {...props} />
        ),
        img: ({node, ...props}) => (
            <img style={{maxWidth: '100%', height: 'auto'}} {...props} alt={props.alt || ''}/>
        ),
    };

    const card = (
        <React.Fragment>
            <CardContent sx={{backgroundColor: '#f0f0f0', textAlign: 'left'}}>
                <Typography sx={{fontSize: 14}} color="text.secondary">
                    目次
                </Typography>
                <ul>
                    {headings.map((heading, index) => (
                        <li key={index}>
                            {heading.text}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </React.Fragment>
    );

    return (
        <Box sx={{
            marginX: 'auto',
            width: width * 0.8,
            maxWidth: '1000px',
            paddingBottom: 4,
            alignItems: 'center',
        }}>
            <Typography variant="h2" marginTop={4} marginBottom={2}>{post?.title}</Typography>
            <Card variant="outlined"
                  sx={{marginX: width * 0.01}}>{card}</Card>
            <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}
                           rehypePlugins={[rehypeRaw]}>{markdownContent}</ReactMarkdown>
            {post_id && <LikesButton postId={post_id} />}
        </Box>
    );
}

export default PostPage;
