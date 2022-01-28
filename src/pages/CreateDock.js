import React, { useState, useEffect } from 'react';
import usePersonRequest from '../api/usePersonRequest';
import useDockRequest from '../api/useDockRequest';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import useValidationHook from '../utils/useValidationHook';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Box, Alert } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import UserWindow from '../utils/UserWindow';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

function Copyright() {
	return (
		<Typography
			paddingTop={5}
			variant="body2"
			color="text.secondary"
			align="center"
		>
			{`IDK Studio ${new Date().getFullYear()}.`}
		</Typography>
	);
}

const CreateDock = () => {
	const personAPI = usePersonRequest();
	const validationHook = useValidationHook();
	const [error, setError] = useState(null);
	const [codeError, setCodeError] = useState({ error: false, msg: '' });
	const [stateError, setStateError] = useState({ error: false, msg: '' });
	const [cityError, setCityError] = useState({ error: false, msg: '' });
	const [addressError, setAddressError] = useState({ error: false, msg: '' });
	const [bicycleDockNumberError, setBicycleDockNumberError] = useState({
		error: false,
		msg: '',
	});
	const [bicycleCountError, setBicycleCountError] = useState({
		error: false,
		msg: '',
	});
	const [dockValues, setDockValues] = useState({
		Code: 0,
		State: '',
		City: '',
		Address: '',
		BicycleDockNumber: 0,
		BicycleCount: 0,
	});
	const screen = UserWindow();

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log(dockValues);
		if (validationHook.codeError(dockValues.Code)) {
			setCodeError(validationHook.codeError(dockValues.Code));
		} else {
			setCodeError({ error: false, msg: '' });
		}
		if (validationHook.stateError(dockValues.State, 'dock')) {
			setStateError(validationHook.stateError(dockValues.State, 'dock'));
		} else {
			setStateError({ error: false, msg: '' });
		}
		if (validationHook.cityError(dockValues.City, 'dock')) {
			setCityError(validationHook.cityError(dockValues.City, 'dock'));
		} else {
			setCityError({ error: false, msg: '' });
		}
		if (validationHook.addressError(dockValues.Address, 'dock')) {
			setAddressError(validationHook.addressError(dockValues.Address, 'dock'));
		} else {
			setAddressError({ error: false, msg: '' });
		}
		if (validationHook.bicycleDockNumberError(dockValues.BicycleDockNumber)) {
			setBicycleDockNumberError(
				validationHook.bicycleDockNumberError(dockValues.BicycleDockNumber)
			);
		} else {
			setBicycleDockNumberError({ error: false, msg: '' });
		}
		if (validationHook.bicycleCountError(dockValues.BicycleCount)) {
			setBicycleCountError(
				validationHook.bicycleCountError(dockValues.BicycleCount)
			);
		} else {
			setBicycleCountError({ error: false, msg: '' });
		}
		if (
			!validationHook.codeError(dockValues.Code) &&
			!validationHook.stateError(dockValues.State) &&
			!validationHook.cityError(dockValues.City) &&
			!validationHook.addressError(dockValues.Address) &&
			!validationHook.bicycleDockNumberError(dockValues.BicycleDockNumber) &&
			!validationHook.bicycleCountError(dockValues.BicycleCount)
		) {
			if (dockValues.State === '') {
				dockValues.State = null;
			}
			if (dockValues.City === '') {
				dockValues.City = null;
			}
			if (dockValues.Address === '') {
				dockValues.Address = null;
			}
			submitData(dockValues);
		}
	};

	const submitData = async (personData) => {
		console.log('request : ', personData);
		let newPerson;
		try {
			newPerson = await personAPI.createPerson(personData);
		} catch (error) {
			setError(error.response.data.msg);
		}
		console.log('response: ', newPerson);
		setdockValues({
			Code: 0,
			Role: 'CLIENT',
			Name: '',
			Surname: '',
			State: '',
			City: '',
			Address: '',
			Email: '',
			MobileNumber: '',
			BicycleCount: 0,
		});
	};

	const handleChange = (event) => {
		event.preventDefault();
		setdockValues({
			...dockValues,
			[event.target.name]: event.target.value,
		});
	};

	console.log(dockValues);

	return (
		<Container component="main" maxWidth="md">
			<CssBaseline />
			<Box
				sx={{
					marginTop: 9,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					paddingLeft: screen.dynamicWidth < 600 ? 2 : 27,
					paddingRight: 2,
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: '#648381' }}>
					<CategoryIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Create New Client
				</Typography>
				<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
					{error && (
						<Box
							sx={{
								paddingTop: 2,
								paddingBottom: 2,
								bgcolor: 'background.paper',
							}}
						>
							<Alert severity="error">{error}</Alert>
						</Box>
					)}
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								error={codeError?.error ? true : false}
								helperText={codeError?.msg}
								required
								autoFocus
								fullWidth
								label="Code"
								name="Code"
								type="number"
								value={dockValues.Code}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								error={nameError.error ? true : false}
								helperText={nameError?.msg}
								name="Name"
								required
								fullWidth
								label="Name"
								value={dockValues.Name}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								error={surnameError.error ? true : false}
								helperText={surnameError?.msg}
								name="Surname"
								required
								fullWidth
								label="Surname"
								value={dockValues.Surname}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								error={stateError.error ? true : false}
								helperText={stateError?.msg}
								name="State"
								fullWidth
								label="State"
								value={dockValues.State}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								error={cityError.error ? true : false}
								helperText={cityError?.msg}
								name="City"
								fullWidth
								label="City"
								value={dockValues.City}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								error={addressError.error ? true : false}
								helperText={addressError?.msg}
								name="Address"
								fullWidth
								label="Address"
								value={dockValues.Address}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								error={emailError.error ? true : false}
								helperText={emailError?.msg}
								name="Email"
								required
								fullWidth
								label="Email"
								value={dockValues.Email}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								error={mobileNumberError.error ? true : false}
								helperText={mobileNumberError?.msg}
								name="MobileNumber"
								required
								fullWidth
								label="Mobile Number"
								value={dockValues.MobileNumber}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								error={bicycleCountError?.error ? true : false}
								helperText={bicycleCountError?.msg}
								fullWidth
								label="Bicycle Count"
								name="BicycleCount"
								type="number"
								value={dockValues.BicycleCount}
								onChange={handleChange}
							/>
						</Grid>
					</Grid>
					<Button
						fullWidth
						type="submit"
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Create Bicycle
					</Button>
					<Grid container justifyContent="flex-end">
						<Grid item>
							<Link style={{ color: '#648381' }} to="/person" variant="body2">
								Go to bicycles
							</Link>
						</Grid>
					</Grid>
				</Box>
				<Copyright sx={{ mt: 5 }} />
			</Box>
		</Container>
	);
};

export default CreateProduct;
