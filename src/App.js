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
import CreatePerson from './pages/CreatePerson';
import CreateDock from './pages/CreateDock';
import ClientRoute from './components/ClientRoute';
import AdminRoute from './components/AdminRoute';
import Restricted from './pages/Restricted';
import ErrorPage from './pages/Error';

function App() {
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
				<Route
					exact
					path="bicycle"
					element={
						<ClientRoute>
							<Bicycle />
						</ClientRoute>
					}
				/>
				<Route
					exact
					path="create_bicycle"
					element={
						<AdminRoute>
							<CreateBicycle />
						</AdminRoute>
					}
				/>
				<Route
					exact
					path="dock"
					element={
						<ClientRoute>
							<Dock />
						</ClientRoute>
					}
				/>
				<Route
					exact
					path="create_dock"
					element={
						<AdminRoute>
							<CreateDock />
						</AdminRoute>
					}
				/>
				<Route
					exact
					path="person"
					element={
						<AdminRoute>
							<Person />
						</AdminRoute>
					}
				/>
				<Route
					exact
					path="create_person"
					element={
						<AdminRoute>
							<CreatePerson />
						</AdminRoute>
					}
				/>
				<Route
					exact
					path="restricted"
					element={
						<ClientRoute>
							<Restricted />
						</ClientRoute>
					}
				/>
				<Route path="/*" element={<ErrorPage />} />
			</Routes>
		</ThemeProvider>
	);
}

export default App;
