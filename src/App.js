import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
//Import the pages

import Bicycle from './pages/Bicycle';
import Dock from './pages/Dock';
import Login from './pages/Login';
import Person from './pages/Person';
// import PrivateRoute from './components/PrivateRoute';
// import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ScrollToTop from './utils/ScrollToTop';
// import Restricted from './pages/Restricted';

function App() {
	const [darkMode, setDarkMode] = useState(true);
	const theme = createTheme({
		palette: {
			mode: `${darkMode ? 'dark' : 'light'}`,
			primary: {
				main: `${darkMode ? '#37718E' : '#648381'}`,
			},
			secondary: {
				main: `${darkMode ? '#254E70' : '#FFBF46'}`,
			},
		},
	});
	return (
		<ThemeProvider theme={theme}>
			<Router>
				<CssBaseline />
				<ScrollToTop />
				<Navbar setDarkMode={setDarkMode} darkMode={darkMode} />
				<Routes>
					<Route exact path="/" element={<Login />} />
					<Route exact path="bicycle" element={<Bicycle />} />
					<Route exact path="dock" element={<Dock />} />
					<Route exact path="person" element={<Person />} />
				</Routes>
				<div className="list">
					<ul>
						<li>
							<Link to="/">Login</Link>
						</li>
						<li>
							<Link to="dock">Dock</Link>
						</li>
						<li>
							<Link to="bicycle">Bicycle</Link>
						</li>
						<li>
							<Link to="person">Person</Link>
						</li>
					</ul>
				</div>
			</Router>
		</ThemeProvider>
	);
}

export default App;
