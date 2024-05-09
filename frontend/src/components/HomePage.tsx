import React, {useState} from "react";
import {
    Box,
    Button,
    TextField,
    Typography
} from "@mui/material";

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
    const postsPerPage = 4;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPostsList = blogposts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        const maxPages = Math.ceil(blogposts.length / postsPerPage);
        setCurrentPage(prev => Math.min(prev + 1, maxPages));
    };

    return (
        <Box sx={{
            maxWidth: 1200,
            margin: 'auto',
            width: '100%',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start'
        }}>
            <Typography variant="h2" sx={{borderBottom: 1, borderColor: 'grey.300', pb: 1, mb: 3}}>Home</Typography>
            <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {currentPostsList.map((post) => (
                    <Box key={post.id}
                         sx={{width: '150%', border: 1, borderColor: 'grey.300', p: 2, mb: 2}}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%'
                        }}>
                            <Typography variant="h6">{post.title}</Typography>
                            <Box sx={{width: 100, height: 100, bgcolor: 'grey.200'}}>
                                <img src={post.imageUrl} alt={post.title} style={{width: '100%', height: '100%'}}/>
                            </Box>
                        </Box>
                    </Box>
                ))}
                <Box marginBottom={4} sx={{display: 'flex', alignItems: 'center'}}>
                    <Button variant="outlined" size="large" onClick={handlePrevPage}>prev</Button>
                    <TextField
                        label="page"
                        variant="outlined"
                        type="number"
                        size="small"
                        value={currentPage}
                        onChange={(e) => setCurrentPage(Number(e.target.value))}
                        sx={{mx: 2}}
                    />
                    <Button variant="outlined" size="large" onClick={handleNextPage}>next</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default HomePage;
