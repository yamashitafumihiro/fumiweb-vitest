import React, {useState} from "react";
import {
    Box,
    Button, Grid,
    TextField,
    Typography
} from "@mui/material";
import {useWindowSize} from "../hooks/useWindowSize.tsx";

const blogposts = [
    {id: 1, title: "First Post", imageUrl: "../public/vite.svg"},
    {id: 2, title: "Second Post", imageUrl: "../public/vite.svg"},
    {id: 3, title: "Third Post", imageUrl: "../public/vite.svg"},
    {id: 4, title: "Fourth Post", imageUrl: "../public/vite.svg"},
    {id: 5, title: "Fifth Post", imageUrl: "../public/vite.svg"},
    {id: 6, title: "Sixth Post", imageUrl: "../public/vite.svg"},
    {id: 7, title: "Seventh Post", imageUrl: "../public/vite.svg"},
    {id: 8, title: "Eighth Post", imageUrl: "../public/vite.svg"},
    {id: 9, title: "Ninth Post", imageUrl: "../public/vite.svg"},
];

const HomePage: React.FC = () => {
    const [width, height] = useWindowSize();

    const postsPerPage = 4;
    const maxPages = Math.ceil(blogposts.length / postsPerPage);
    const [inputPage, setInputPage] = useState<null | number>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPostsList = blogposts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, maxPages));
    };

    const handleMoveClick = () => {
        const targetPage = Number(inputPage) ? Math.max(1, Math.min(Number(inputPage), maxPages)) : 1;
        setCurrentPage(targetPage);
    };

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
            <Typography marginTop={2} variant="h2"
                        sx={{borderBottom: 1, borderColor: 'grey.300', pb: 1, mb: 3}}>Home</Typography>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {currentPostsList.map((post) => (
                    <Box key={post.id}
                         sx={{width: '100%', border: 1, borderColor: 'grey.300', p: 2, mb: 2}}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <Typography variant="h6">{post.title}</Typography>
                            <Box sx={{width: 100, height: 100, bgcolor: 'grey.200'}}>
                                <img src={post.imageUrl} alt={post.title} style={{width: '100%', height: '100%'}}/>
                            </Box>
                        </Box>
                    </Box>
                ))}
                <Grid container alignItems='center' margin={4}>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined" size="large" onClick={handlePrevPage}>prev</Button>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            label="page"
                            variant="outlined"
                            type="number"
                            size="small"
                            value={inputPage || ''}
                            onChange={(e) => setInputPage(Number(e.target.value))}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined" onClick={() => handleMoveClick()}
                                disabled={!inputPage || inputPage > maxPages}>move</Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined" size="large" onClick={handleNextPage}>next</Button>
                    </Grid>
                    <Grid item xs={2}></Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default HomePage;
