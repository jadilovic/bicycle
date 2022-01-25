import React, { useEffect, useState } from 'react';
import { getUserData, isAuthenticated } from '../auth/Authentication';
// import { useHistory } from 'react-router-dom';
import UserMenu from './UserMenu';
import { AppBar } from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import UserWindow from '../utils/UserWindow';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PersonIcon from '@mui/icons-material/Person';

const drawerWidth = 180;

const Navbar = (props) => {
	const screen = UserWindow();
	const { setDarkMode, darkMode } = props;
	// const history = useHistory();
	const [authenticated, setAuthenticated] = useState(null);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [menuClicked, setMenuClicked] = useState(false);
	let drawerMenu = [
		{
			section: 'Home',
			icon: null,
			linkToSection: '/bicycle',
			permission: 'APPCLIENT',
		},
		{
			section: 'Dock',
			icon: null,
			linkToSection: '/dock',
			permission: 'APPCLIENT',
		},
	];
	let drawerAdmin = [
		{
			section: 'Create Bicycle',
			icon: <PersonIcon />,
			linkToSection: '/create_bicycle',
			permission: 'APPADMIN',
		},
		{
			section: 'Create Dock',
			icon: <PeopleOutlineIcon />,
			linkToSection: '/create_dock',
			permission: 'APPADMIN',
		},
		{
			section: 'Create APPCLIENT',
			icon: <FormatListNumberedIcon />,
			linkToSection: '/create_APPCLIENT',
			permission: 'APPADMIN',
		},
		{
			section: 'APPCLIENT',
			icon: <LibraryBooksIcon />,
			linkToSection: '/APPCLIENT',
			permission: 'APPADMIN',
		},
	];
	let role = '';
	if (isAuthenticated()) {
		role = getUserData().Role;
		if (role === 'APPCLIENT') {
			drawerAdmin = drawerAdmin.filter(
				(menu) => menu.permission === 'APPCLIENT'
			);
		}
	} else {
		drawerAdmin = [];
	}

	const handleClickAway = () => {
		if (menuClicked) {
			setMenuClicked(false);
		} else {
			if (screen.dynamicWidth < 600) {
				setDrawerOpen(false);
			}
		}
	};

	const handleDrawerToggle = () => {
		setMenuClicked(true);
		setDrawerOpen(!drawerOpen);
	};

	if (authenticated === null) {
		setAuthenticated(isAuthenticated());
	}

	useEffect(() => {
		if (screen.dynamicWidth < 600) {
			setDrawerOpen(false);
		} else {
			setDrawerOpen(true);
		}
	}, [screen]);

	useEffect(() => {
		// history.listen(() => {
		// 	console.log(window.location.pathname);
		// 	setAuthenticated(isAuthenticated());
		// });
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const toggleTheme = () => {
		if (darkMode) {
			setDarkMode(false);
		} else {
			setDarkMode(true);
		}
	};

	const handleMenuClick = (menuLink, category) => {
		if (screen.dynamicWidth < 600) {
			setDrawerOpen(false);
		}
		localStorage.setItem('category', category);
		//	history.push(menuLink);
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			{/* <AppBar position="static"> */}
			<AppBar
				position="fixed"
				sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
			>
				<Toolbar>
					{/* {authenticated && ( */}
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: 'none' } }}
					>
						<MenuIcon />
					</IconButton>
					{/* )} */}
					<Typography
						variant="h6"
						component="div"
						paddingRight={2}
						paddingTop={1.25}
					>
						<Link underline="none" href="/materials" color="white">
							<img
								style={{ width: '100%', height: 40 }}
								src=""
								alt="bild-it logo"
							/>
						</Link>
					</Typography>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Sadnice
					</Typography>
					<Typography>
						<IconButton
							sx={{ ml: 1 }}
							onClick={() => toggleTheme()}
							color="inherit"
						>
							{darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
						</IconButton>
					</Typography>
					{authenticated ? (
						<UserMenu />
					) : (
						<Link underline="none" href="/" color="white">
							<Typography variant="h6" component="div">
								{'Prijava'}
							</Typography>
						</Link>
					)}
				</Toolbar>
			</AppBar>
			{/* {authenticated && ( */}
			<ClickAwayListener onClickAway={handleClickAway}>
				<Drawer
					variant="persistent"
					sx={{
						width: drawerWidth,
						flexShrink: 0,
						[`& .MuiDrawer-paper`]: {
							width: drawerWidth,
							boxSizing: 'border-box',
						},
					}}
					open={drawerOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
				>
					<Toolbar />
					<Box sx={{ overflow: 'auto' }}>
						<List>
							{drawerMenu.map((menuItem, index) => (
								<ListItem
									onClick={() =>
										handleMenuClick(menuItem.linkToSection, menuItem.section)
									}
									button
									key={index}
								>
									{/* <ListItemIcon>{menuItem.icon}</ListItemIcon> */}
									<img
										style={{ width: '30px', height: '30px', marginRight: 25 }}
										src={menuItem.icon}
										alt="icon instead"
									/>
									<ListItemText primary={menuItem.section} />
								</ListItem>
							))}
						</List>
						<Divider />
						<List>
							{drawerAdmin.map((item, index) => (
								<ListItem
									button
									key={index}
									onClick={() =>
										handleMenuClick(item.linkToSection, item.section)
									}
								>
									<ListItemIcon>{item.icon}</ListItemIcon>
									<ListItemText primary={item.section} />
								</ListItem>
							))}
						</List>
					</Box>
				</Drawer>
			</ClickAwayListener>
			{/* )} */}
		</Box>
	);
};

export default Navbar;
