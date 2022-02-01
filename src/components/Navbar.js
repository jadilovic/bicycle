import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserData, isAuthenticated } from '../auth/Authentication';
import UserMenu from './UserMenu';
import { AppBar } from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';
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
import BikeScooterIcon from '@mui/icons-material/BikeScooter';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PlaceIcon from '@mui/icons-material/Place';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import PersonIcon from '@mui/icons-material/Person';
import idk_studio from '../images/idk_studio.jpg';

const drawerWidth = 200;

const Navbar = (props) => {
	const screen = UserWindow();
	const { setDarkMode, darkMode, authenticated, setAuthenticated } = props;
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [menuClicked, setMenuClicked] = useState(false);

	let drawerMenu = [
		{
			section: 'Bicycles',
			icon: <BikeScooterIcon />,
			linkToSection: '/bicycle',
			permission: 'CLIENT',
		},
		{
			section: 'Docks',
			icon: <PlaceIcon />,
			linkToSection: '/dock',
			permission: 'CLIENT',
		},
	];
	let drawerAdmin = [
		{
			section: 'Create Bicycle',
			icon: <DirectionsBikeIcon />,
			linkToSection: '/create_bicycle',
			permission: 'APPADMIN',
		},
		{
			section: 'Create Dock',
			icon: <AddLocationIcon />,
			linkToSection: '/create_dock',
			permission: 'APPADMIN',
		},
		{
			section: 'Create Client',
			icon: <PersonIcon />,
			linkToSection: '/create_person',
			permission: 'APPADMIN',
		},
		{
			section: 'Clients',
			icon: <PeopleOutlineIcon />,
			linkToSection: '/person',
			permission: 'APPADMIN',
		},
	];
	let role = '';
	if (isAuthenticated()) {
		role = getUserData().Role;
		if (role === 'CLIENT') {
			drawerAdmin = drawerAdmin.filter((menu) => menu.permission === 'CLIENT');
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

	const toggleTheme = () => {
		if (darkMode) {
			setDarkMode(false);
		} else {
			setDarkMode(true);
		}
	};

	const handleMenuClick = () => {
		if (screen.dynamicWidth < 600) {
			setDrawerOpen(false);
		}
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar
				position="fixed"
				sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
			>
				<Toolbar>
					{authenticated && (
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleDrawerToggle}
							sx={{ mr: 2, display: { sm: 'none' } }}
						>
							<MenuIcon />
						</IconButton>
					)}
					<Typography
						variant="h6"
						component="div"
						paddingRight={2}
						paddingTop={1.25}
					>
						<Link to="/bicycle">
							<img
								style={{ width: '100%', height: 40 }}
								src={idk_studio}
								alt="bild-it logo"
							/>
						</Link>
					</Typography>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Bicycle-sharing
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
					{authenticated && <UserMenu />}
				</Toolbar>
			</AppBar>
			{authenticated && (
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
									<Link
										key={index}
										to={menuItem.linkToSection}
										style={{
											textDecoration: 'none',
											color: `${darkMode ? 'white' : 'black'} `,
										}}
									>
										<ListItem onClick={handleMenuClick} button>
											<ListItemIcon>{menuItem.icon}</ListItemIcon>
											<ListItemText primary={menuItem.section} />
										</ListItem>
									</Link>
								))}
							</List>
							<Divider />
							<List>
								{drawerAdmin.map((item, index) => (
									<Link
										key={index}
										to={item.linkToSection}
										style={{
											textDecoration: 'none',
											color: `${darkMode ? 'white' : 'black'} `,
										}}
									>
										<ListItem onClick={handleMenuClick} button>
											<ListItemIcon>{item.icon}</ListItemIcon>
											<ListItemText primary={item.section} />
										</ListItem>
									</Link>
								))}
							</List>
						</Box>
					</Drawer>
				</ClickAwayListener>
			)}
		</Box>
	);
};

export default Navbar;
