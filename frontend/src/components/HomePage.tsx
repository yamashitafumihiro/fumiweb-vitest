import React, {useState} from "react";
import {
    Box,
    Button,
    Grid, Stack,
    Typography,
} from "@mui/material";
import {useWindowSize} from "../hooks/useWindowSize.tsx";
import {Link} from "react-router-dom";

export const blogposts = [
    {
        id: 1,
        title: "init post",
        imageUrl: "/images/technology.png",
        slug: "initPost",
        date: "2024/07/05"
    },
];

const HomePage: React.FC = () => {
    const [width] = useWindowSize();

    const postsPerPage = 4;
    const maxPages = Math.ceil(blogposts.length / postsPerPage);
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

    return (
        <Box sx={{
            marginX: 'auto',
            width: width * 0.8,
            maxWidth: '1000px',
            display: 'flex',
            flexDirection: 'column',
            alignItem: 'center',
            paddingBottom: 4
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
                                <Stack alignItems="flex-start">
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
                <Grid container alignItems='center'>
                    <Grid item xs={6}>
                        <Button variant="outlined" size="large" onClick={handlePrevPage}
                                disabled={blogposts.length <= 4}
                                sx={{textTransform: "none"}}>
                            prev
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="outlined" size="large" onClick={handleNextPage}
                                disabled={blogposts.length <= 4}
                                sx={{textTransform: "none"}}>
                            next
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default HomePage;
