import './App.css'
import {Box, LinearProgress, Typography} from "@mui/material";
import React, {Suspense} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import HomePage from "./components/HomePage.tsx";
import Navbar from "./components/Navbar.tsx";
import AboutPage from "./components/About.tsx";

const Loading: React.FC = () => {
    return (
        <Box sx={{width: '100%'}}>
            <LinearProgress/>
            <Typography role="paragraph">Loading...</Typography>
        </Box>
    );
};

const App: React.FC = () => {
    return (
        <Suspense fallback={<Loading/>}>
            <BrowserRouter>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace/>}></Route>
                    <Route path="/home" element={<HomePage/>}></Route>
                    <Route path="/about" element={<AboutPage/>}></Route>
                </Routes>
            </BrowserRouter>
        </Suspense>
    )
}

export default App;
