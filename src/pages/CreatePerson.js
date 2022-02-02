import React, { useState, useEffect } from 'react';
import usePersonRequest from '../api/usePersonRequest';
import LoadingPage from '../components/LoadingPage';
import { Link } from 'react-router-dom';
import useValidationHook from '../utils/useValidationHook';
import useUniqueValidationHook from '../utils/useUniqueValidationHook';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import UserWindow from '../utils/UserWindow';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
	const uniqueValidationHook = useUniqueValidationHook();
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
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMsg, setSnackbarMsg] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState('');
	const [persons, setPersons] = useState([]);
	const [loading, setLoading] = useState(true);

	const loadPersons = async () => {
		const loadedPersons = await personAPI.getPersons();
		setPersons([...loadedPersons]);
		setLoading(false);
	};

	useEffect(() => {
		loadPersons();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenSnackbar(false);
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		let uniqueError = false;
		const codeValidError = validationHook.codeError(personValues.Code);
		if (codeValidError) {
			setCodeError(codeValidError);
		} else {
			uniqueError = uniqueValidationHook.personCodeError(
				personValues.Code,
				persons
			);
			if (uniqueError) {
				setCodeError(uniqueError);
			} else {
				setCodeError({ error: false, msg: '' });
			}
		}

		const nameValidError = validationHook.nameError(personValues.Name);
		if (nameValidError) {
			setNameError(nameValidError);
		} else {
			setNameError({ error: false, msg: '' });
		}

		const surnameValidError = validationHook.surnameError(personValues.Surname);
		if (surnameValidError) {
			setSurnameError(surnameValidError);
		} else {
			setSurnameError({ error: false, msg: '' });
		}

		const stateValidError = validationHook.stateError(personValues.State);
		if (stateValidError) {
			setStateError(stateValidError);
		} else {
			setStateError({ error: false, msg: '' });
		}

		const cityValidError = validationHook.cityError(personValues.City);
		if (cityValidError) {
			setCityError(cityValidError);
		} else {
			setCityError({ error: false, msg: '' });
		}

		const addressValidError = validationHook.addressError(personValues.Address);
		if (addressValidError) {
			setAddressError(addressValidError);
		} else {
			setAddressError({ error: false, msg: '' });
		}

		const emailValidError = validationHook.emailError(personValues.Email);
		if (emailValidError) {
			setEmailError(emailValidError);
		} else {
			setEmailError({ error: false, msg: '' });
		}

		const mobileValidError = validationHook.mobileNumberError(
			personValues.MobileNumber
		);
		if (mobileValidError) {
			setMobileNumberError(mobileValidError);
		} else {
			setMobileNumberError({ error: false, msg: '' });
		}

		if (
			!codeValidError &&
			!uniqueError &&
			!nameValidError &&
			!surnameValidError &&
			!stateValidError &&
			!cityValidError &&
			!addressValidError &&
			!emailValidError &&
			!mobileValidError
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
		setLoading(true);
		try {
			const newCreatedPerson = await personAPI.createPerson(personData);
			if (newCreatedPerson) {
				setSnackbarMsg(
					`New client with code ${newCreatedPerson.Code} and name ${newCreatedPerson.Name} was created!`
				);
				setSnackbarSeverity('success');
				setOpenSnackbar(true);
			} else {
				setSnackbarMsg(
					`Failed to create new client with code ${personData.Code} and name ${personData.Name}!`
				);
				setSnackbarSeverity('error');
				setOpenSnackbar(true);
			}
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
		setLoading(false);
	};

	const handleChange = (event) => {
		event.preventDefault();
		setPersonValues({
			...personValues,
			[event.target.name]: event.target.value,
		});
	};

	if (loading) {
		return <LoadingPage />;
	}

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
				<Stack spacing={2} sx={{ width: '100%' }}>
					<Snackbar
						open={openSnackbar}
						autoHideDuration={5000}
						onClose={handleCloseSnackbar}
					>
						<Alert
							onClose={handleCloseSnackbar}
							severity={snackbarSeverity}
							sx={{ width: '100%' }}
						>
							{snackbarMsg}
						</Alert>
					</Snackbar>
				</Stack>
			</Box>
		</Container>
	);
};

export default CreateProduct;
