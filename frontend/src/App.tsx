import './App.css'
import {Box, createTheme, LinearProgress, ThemeProvider, Typography} from "@mui/material";
import React, {Suspense} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import HomePage from "./components/HomePage.tsx";
import Navbar from "./components/Navbar.tsx";
import AboutPage from "./components/About.tsx";
import TimelinePage from "./components/TimelinePage/TimelinePage.tsx";
import PostPage from "./components/PostPage.tsx";
import Footer from "./components/Footer.tsx";

const Loading: React.FC = () => {
    return (
        <Box sx={{width: '100%'}}>
            <LinearProgress/>
            <Typography role="paragraph">Loading...</Typography>
        </Box>
    );
};

const theme = createTheme({
    palette: {
        mode: 'light',
    },
});

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <Suspense fallback={<Loading/>}>
                <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
                    <BrowserRouter>
                        <Navbar/>
                        <Routes>
                            <Route path="/" element={<Navigate to="/home" replace/>}></Route>
                            <Route path="/home" element={<HomePage/>}></Route>
                            <Route path="post/:postId" element={<PostPage/>}></Route>
                            <Route path="/about" element={<AboutPage/>}></Route>
                            <Route path="timeline" element={<TimelinePage/>}></Route>
                        </Routes>
                        <Footer/>
                    </BrowserRouter>
                </Box>
            </Suspense>
        </ThemeProvider>
    )
}

export default App;
