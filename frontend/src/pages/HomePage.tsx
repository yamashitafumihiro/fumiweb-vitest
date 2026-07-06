import React, { useState } from "react";
import {
    Box,
    Button,
    Grid, Stack,
    Typography,
} from "@mui/material";
import { useWindowSize } from "../hooks/useWindowSize.tsx";
import { Link } from "react-router-dom";
import { posts } from "../generated/postsIndex.ts";
import { formatDate } from "../lib/posts.ts";

const HomePage: React.FC = () => {
    const [width] = useWindowSize();

    // posts は生成時点で新しい順にソート済み
    const postsPerPage = 4;
    const maxPages = Math.ceil(posts.length / postsPerPage);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPostsList = posts.slice(indexOfFirstPost, indexOfLastPost);

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
                sx={{ borderBottom: 1, borderColor: 'grey.300', pb: 1, mb: 3 }}>fumiweb</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {currentPostsList.map((post) => (
                    <Box key={post.slug}
                        sx={{ width: '100%', border: 1, borderColor: 'grey.300', p: 2, mb: 2 }}>
                        <Link to={`../post/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <Stack alignItems="flex-start" sx={{ overflow: 'hidden', minWidth: '0', flex: '1', mr: 2 }}>
                                    <Typography noWrap component='p' variant="h5" sx={{ width: '100%' }}>{post.title}</Typography>
                                    <Typography variant="body2"
                                        sx={{ marginTop: 1, color: 'grey.500' }}>{formatDate(post.date)}</Typography>
                                </Stack>
                                <Box sx={{ flexShrink: 0, width: 100, height: 100, bgcolor: 'grey.200' }}>
                                    <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%' }} />
                                </Box>
                            </Box>
                        </Link>
                    </Box>
                ))}
                <Grid container alignItems='center'>
                    <Grid item xs={6}>
                        <Button variant="outlined" size="large" onClick={handlePrevPage}
                            disabled={currentPage <= 1}
                            sx={{ textTransform: "none" }}>
                            prev
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="outlined" size="large" onClick={handleNextPage}
                            disabled={currentPage >= maxPages}
                            sx={{ textTransform: "none" }}>
                            next
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default HomePage;
