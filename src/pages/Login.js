import React, { useState, useEffect } from 'react';
import usePersonRequest from '../api/usePersonRequest';
import { login } from '../auth/Authentication';
import { Navigate } from 'react-router-dom';
import { Avatar, Alert } from '@mui/material';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

function Copyright(props) {
	return (
		<Typography
			variant="body2"
			color="text.secondary"
			align="center"
			{...props}
		>
			{'Copyright © '}
			<a color="inherit" href="https://www.idkstudio.com/">
				IDK Studio
			</a>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

export default function SignIn(props) {
	const { setAuthenticated } = props;
	const personAPI = usePersonRequest();
	const [next, setNext] = useState(false);
	const [user, setUser] = useState({ email: '', code: '' });
	const [error, setError] = useState(false);

	useEffect(() => {
		localStorage.removeItem('user');
		setAuthenticated(false);
	}, []);

	const checkUserCredentials = async () => {
		const personList = await personAPI.getPersons();
		return personList.find(
			(person) =>
				person.Email === user.email && person.Code === Number(user.code)
		);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const user = await checkUserCredentials();
		console.log(user);
		if (user) {
			console.log(user);
			login(user);
			setAuthenticated(true);
			setNext(true);
		} else {
			setError(true);
		}
	};

	const handleChange = (event) => {
		event.preventDefault();
		setUser({ ...user, [event.target.name]: event.target.value });
	};

	if (next) {
		return <Navigate to="/bicycle" />;
	}

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					{error && (
						<Box
							sx={{
								paddingTop: 2,
								paddingBottom: 2,
								bgcolor: 'background.paper',
							}}
						>
							<Alert severity="error">Invalid user credentials</Alert>
						</Box>
					)}
					<TextField
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoFocus
						value={user.email}
						onChange={handleChange}
					/>
					<TextField
						margin="normal"
						required
						fullWidth
						name="code"
						label="Code"
						id="code"
						value={user.code}
						onChange={handleChange}
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Sign In
					</Button>
					<Grid container>
						<Grid item xs>
							<Typography>Admin Email:</Typography>
						</Grid>
						<Grid item md>
							<Typography>appadmin@sdinformatika.hr</Typography>
						</Grid>
					</Grid>
					<Grid container>
						<Grid item xs>
							<Typography>Admin Code:</Typography>
						</Grid>
						<Grid item xs>
							<Typography align="right">9999</Typography>
						</Grid>
					</Grid>
					<Grid container>
						<Grid item xs>
							<Typography>Client Email:</Typography>
						</Grid>
						<Grid item xs>
							<Typography align="right">john.doe@com.com</Typography>
						</Grid>
					</Grid>
					<Grid container>
						<Grid item xs>
							<Typography>Client Code:</Typography>
						</Grid>
						<Grid item xs>
							<Typography align="right">1025</Typography>
						</Grid>
					</Grid>
				</Box>
			</Box>
			<Copyright sx={{ mt: 8, mb: 4 }} />
		</Container>
	);
}
