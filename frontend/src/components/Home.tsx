import React from "react";
import {Box, Container, createTheme, CssBaseline, Grid, ThemeProvider, Typography} from "@mui/material";

const blogposts = [
    {id: 1, title: "First Post", imageUrl: "../public/vite.svg"},
    {id: 2, title: "Second Post", imageUrl: "../public/vite.svg"},
    {id: 3, title: "Third Post", imageUrl: "../public/vite.svg"},
];

const defaultTheme = createTheme();

const Home: React.FC = () => {
    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline/>
            <Container maxWidth="lg">
                <Typography variant="h2" sx={{
                    textAlign: 'center',
                    borderBottom: 1,
                    borderColor: 'grey.300',
                    pb: 1,
                    mb: 3
                }}>Home</Typography>

                <Grid container spacing={2} sx={{width: '100%'}}>
                    {blogposts.map((post) => (
                        <Grid item xs={12} key={post.id} sx={{border: 1, borderColor: 'grey.300', p: 2}}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%'
                            }}>
                                <Typography variant="h6">{post.title}</Typography>
                                <Box sx={{width: 100, height: 100, bgcolor: 'grey.200'}}>
                                    <img src={post.imageUrl} alt={post.title} style={{width: '100%', height: '100%'}}/>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </ThemeProvider>
    );
}

export default Home;