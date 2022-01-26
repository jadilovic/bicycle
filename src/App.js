import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Bicycle from './pages/Bicycle';
import Dock from './pages/Dock';
import Login from './pages/Login';
import Person from './pages/Person';
import Navbar from './components/Navbar';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ScrollToTop from './utils/ScrollToTop';
import { isAuthenticated } from './auth/Authentication';
import CreateBicycle from './pages/CreateBicycle';
// import Restricted from './pages/Restricted';

function App() {
	console.log('app render : ! @ @@ !');
	const [authenticated, setAuthenticated] = useState(false);
	const [darkMode, setDarkMode] = useState(true);

	useEffect(() => {
		setAuthenticated(isAuthenticated());
	}, []);

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
			<CssBaseline />
			<ScrollToTop />
			<Navbar
				authenticated={authenticated}
				setAuthenticated={setAuthenticated}
				setDarkMode={setDarkMode}
				darkMode={darkMode}
			/>
			<Routes>
				<Route
					exact
					path="/"
					element={<Login setAuthenticated={setAuthenticated} />}
				/>
				<Route exact path="bicycle" element={<Bicycle />} />
				<Route exact path="create_bicycle" element={<CreateBicycle />} />
				<Route exact path="dock" element={<Dock />} />
				<Route exact path="person" element={<Person />} />
			</Routes>
		</ThemeProvider>
	);
}

export default App;
