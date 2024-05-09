import React from "react";
import {
    AppBar,
    Box,
    Button,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Typography
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {Link} from "react-router-dom";

type Page = {
    href: string;
    key: string;
}

const pages: Page[] = [
    {
        key: 'home',
        href: '/home',
    },
];

const Navbar: React.FC = () => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="static" sx={{width: '100vw'}}>
            <Container maxWidth={false}>
                <Toolbar disableGutters>
                    <Typography variant="h6"
                                noWrap
                                component={Link}
                                to={'/'}
                                sx={{
                                    mr: 2,
                                    display: {xs: 'none', md: 'flex'},
                                    fontWeight: 700,
                                    letterSpacing: '.1rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}>
                        Navbar
                    </Typography>

                    <Box marginLeft={2} sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: {xs: 'block', md: 'none'},
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.key} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center" component={Link}
                                                to={page.href}>
                                        {page.key}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <Box marginLeft={2} sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {pages.map((page) => (
                            <Button
                                key={page.key}
                                sx={{my: 2, color: 'white', display: 'block'}}
                                component={Link}
                                to={page.href}
                            >
                                {page.key}
                            </Button>
                        ))}
                    </Box>

                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default Navbar;