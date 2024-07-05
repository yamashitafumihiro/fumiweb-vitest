import React, {useState} from "react";
import {
    Box,
    Button,
    Grid, Stack,
    TextField,
    Typography,
} from "@mui/material";
import {useWindowSize} from "../hooks/useWindowSize.tsx";
import {Link} from "react-router-dom";


const blogposts = [
    {
        id: 1,
        title: "いにしゃるぽすと",
        imageUrl: "../public/images/technology.png",
        slug: "initPost",
        date: "2024/07/05"
    },
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
                        sx={{borderBottom: 1, borderColor: 'grey.300', pb: 1, mb: 3}}>fumiweb</Typography>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {currentPostsList.map((post) => (
                    <Box key={post.id}
                         sx={{width: '100%', border: 1, borderColor: 'grey.300', p: 2, mb: 2}}>
                        <Link to={`../post/${post.slug}`} style={{textDecoration: 'none', color: 'inherit'}}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <Stack>
                                    <Typography variant="h5">{post.title}</Typography>
                                    <Typography variant="body2"
                                                sx={{marginTop: 1, color: 'grey.500'}}>{post.date}</Typography>
                                </Stack>
                                <Box sx={{width: 100, height: 100, bgcolor: 'grey.200'}}>
                                    <img src={post.imageUrl} alt={post.title} style={{width: '100%', height: '100%'}}/>
                                </Box>
                            </Box>
                        </Link>
                    </Box>
                ))}
                <Grid container alignItems='center' margin={4}>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined" size="large" onClick={handlePrevPage}
                                sx={{textTransform: "none"}}>prev</Button>
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
                                disabled={!inputPage || inputPage > maxPages} sx={{textTransform: "none"}}>move</Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="outlined" size="large" onClick={handleNextPage} sx={{textTransform: "none"}}>next
                        </Button>
                    </Grid>
                    <Grid item xs={2}></Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default HomePage;
