import React, { useState } from 'react';
import usePersonRequest from '../api/usePersonRequest';
import { Link } from 'react-router-dom';
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

const CreateProduct = () => {
	const personAPI = usePersonRequest();
	const validationHook = useValidationHook();
	const [error, setError] = useState(null);
	const [codeError, setCodeError] = useState({ error: false, msg: '' });
	const [nameError, setNameError] = useState({ error: false, msg: '' });
	const [surnameError, setSurnameError] = useState({ error: false, msg: '' });
	const [stateError, setStateError] = useState({ error: false, msg: '' });
	const [cityError, setCityError] = useState({ error: false, msg: '' });
	const [addressError, setAddressError] = useState({ error: false, msg: '' });
	const [emailError, setEmailError] = useState({ error: false, msg: '' });
	const [mobileNumberError, setMobileNumberError] = useState({
		error: false,
		msg: '',
	});
	const [bicycleCountError, setBicycleCountError] = useState({
		error: false,
		msg: '',
	});
	const [personValues, setPersonValues] = useState({
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
	const screen = UserWindow();

	const handleSubmit = (event) => {
		event.preventDefault();
		if (validationHook.codeError(personValues.Code)) {
			setCodeError(validationHook.codeError(personValues.Code));
		} else {
			setCodeError({ error: false, msg: '' });
		}
		if (validationHook.nameError(personValues.Name)) {
			setNameError(validationHook.nameError(personValues.Name));
		} else {
			setNameError({ error: false, msg: '' });
		}
		if (validationHook.surnameError(personValues.Surname)) {
			setSurnameError(validationHook.surnameError(personValues.Surname));
		} else {
			setSurnameError({ error: false, msg: '' });
		}
		if (validationHook.stateError(personValues.State)) {
			setStateError(validationHook.stateError(personValues.State));
		} else {
			setStateError({ error: false, msg: '' });
		}
		if (validationHook.cityError(personValues.City)) {
			setCityError(validationHook.cityError(personValues.City));
		} else {
			setCityError({ error: false, msg: '' });
		}
		if (validationHook.addressError(personValues.Address)) {
			setAddressError(validationHook.addressError(personValues.Address));
		} else {
			setAddressError({ error: false, msg: '' });
		}
		if (validationHook.emailError(personValues.Email)) {
			setEmailError(validationHook.emailError(personValues.Email));
		} else {
			setEmailError({ error: false, msg: '' });
		}
		if (validationHook.mobileNumberError(personValues.MobileNumber)) {
			setMobileNumberError(
				validationHook.mobileNumberError(personValues.MobileNumber)
			);
		} else {
			setMobileNumberError({ error: false, msg: '' });
		}
		if (validationHook.bicycleCountError(personValues.BicycleCount)) {
			setBicycleCountError(
				validationHook.bicycleCountError(personValues.BicycleCount)
			);
		} else {
			setBicycleCountError({ error: false, msg: '' });
		}
		if (
			!validationHook.codeError(personValues.Code) &&
			!validationHook.nameError(personValues.Name) &&
			!validationHook.surnameError(personValues.Surname) &&
			!validationHook.stateError(personValues.State) &&
			!validationHook.cityError(personValues.City) &&
			!validationHook.addressError(personValues.Address) &&
			!validationHook.emailError(personValues.Email) &&
			!validationHook.mobileNumberError(personValues.MobileNumber) &&
			!validationHook.bicycleCountError(personValues.BicycleCount)
		) {
			if (personValues.State === '') {
				personValues.State = null;
			}
			if (personValues.City === '') {
				personValues.City = null;
			}
			if (personValues.Address === '') {
				personValues.Address = null;
			}
			submitData(personValues);
		}
	};

	const submitData = async (personData) => {
		try {
			await personAPI.createPerson(personData);
		} catch (error) {
			setError(error.response.data.msg);
		}
		setPersonValues({
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
		setPersonValues({
			...personValues,
			[event.target.name]: event.target.value,
		});
	};

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
								value={personValues.Code}
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
								value={personValues.Name}
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
								value={personValues.Surname}
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
								value={personValues.State}
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
								value={personValues.City}
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
								value={personValues.Address}
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
								value={personValues.Email}
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
								value={personValues.MobileNumber}
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
								value={personValues.BicycleCount}
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
						Create Client
					</Button>
					<Grid container justifyContent="flex-end">
						<Grid item>
							<Link style={{ color: '#648381' }} to="/person" variant="body2">
								Go to clients
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
