import React, { useState, useEffect } from 'react';
import useDockRequest from '../api/useDockRequest';
import { Link } from 'react-router-dom';
import useValidationHook from '../utils/useValidationHook';
import useUniqueValidationHook from '../utils/useUniqueValidationHook';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import UserWindow from '../utils/UserWindow';
import LoadingPage from '../components/LoadingPage';
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

const CreateDock = () => {
	const dockAPI = useDockRequest();
	const validationHook = useValidationHook();
	const uniqueValidationHook = useUniqueValidationHook();
	const screen = UserWindow();
	const [error, setError] = useState(null);
	const [codeError, setCodeError] = useState({ error: false, msg: '' });
	const [stateError, setStateError] = useState({ error: false, msg: '' });
	const [cityError, setCityError] = useState({ error: false, msg: '' });
	const [addressError, setAddressError] = useState({ error: false, msg: '' });
	const [bicycleDockNumberError, setBicycleDockNumberError] = useState({
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
	const [loading, setLoading] = useState(true);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMsg, setSnackbarMsg] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState('');
	const [docks, setDocks] = useState([]);

	useEffect(() => {
		loadDocks();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const loadDocks = async () => {
		const loadedDocks = await dockAPI.getDocks();
		setDocks([...loadedDocks]);
		setLoading(false);
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenSnackbar(false);
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		let uniqueError = false;
		const codeValidError = validationHook.codeError(dockValues.Code);
		if (codeValidError) {
			setCodeError(codeValidError);
		} else {
			uniqueError = uniqueValidationHook.dockCodeError(dockValues.Code, docks);
			if (uniqueError) {
				setCodeError(uniqueError);
			} else {
				setCodeError({ error: false, msg: '' });
			}
		}

		const stateValidError = validationHook.stateError(dockValues.State, 'dock');
		if (stateValidError) {
			setStateError(stateValidError);
		} else {
			setStateError({ error: false, msg: '' });
		}

		const cityValidError = validationHook.cityError(dockValues.City, 'dock');
		if (cityValidError) {
			setCityError(cityValidError);
		} else {
			setCityError({ error: false, msg: '' });
		}

		const addressValidError = validationHook.addressError(
			dockValues.Address,
			'dock'
		);
		if (addressValidError) {
			setAddressError(addressValidError);
		} else {
			setAddressError({ error: false, msg: '' });
		}

		const numberValidError = validationHook.bicycleDockNumberError(
			dockValues.BicycleDockNumber
		);
		if (numberValidError) {
			setBicycleDockNumberError(numberValidError);
		} else {
			setBicycleDockNumberError({ error: false, msg: '' });
		}

		if (
			!codeValidError &&
			!uniqueError &&
			!stateValidError &&
			!cityValidError &&
			!addressValidError &&
			!numberValidError
		) {
			submitData(dockValues);
		}
	};

	const submitData = async (dockData) => {
		setLoading(true);
		try {
			const newDock = await dockAPI.createDock(dockData);
			if (newDock) {
				setSnackbarMsg(
					`New dock with code ${newDock.Code} and with ${newDock.BicycleDockNumber} bicycle docks was created!`
				);
				setSnackbarSeverity('success');
				setOpenSnackbar(true);
			} else {
				setSnackbarMsg(
					`Failed to create new dock with code ${dockData.Code} and ${dockData.BicycleDockNumber} bicycle docks!`
				);
				setSnackbarSeverity('error');
				setOpenSnackbar(true);
			}
		} catch (error) {
			setError(error.response.data.msg);
		}
		setDockValues({
			Code: 0,
			State: '',
			City: '',
			Address: '',
			BicycleDockNumber: 0,
			BicycleCount: 0,
		});
		setLoading(false);
	};

	const handleChange = (event) => {
		event.preventDefault();
		setDockValues({
			...dockValues,
			[event.target.name]: event.target.value,
		});
	};

	if (loading) {
		<LoadingPage />;
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
					<AddLocationAltIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Create New Dock
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
								error={stateError.error ? true : false}
								helperText={stateError?.msg}
								required
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
								required
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
								required
								name="Address"
								fullWidth
								label="Address"
								value={dockValues.Address}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								error={bicycleDockNumberError.error ? true : false}
								helperText={bicycleDockNumberError?.msg}
								name="BicycleDockNumber"
								required
								fullWidth
								label="Bicycle Dock Number (Number of docks for bicycles)"
								type="number"
								value={dockValues.BicycleDockNumber}
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
						Create Dock
					</Button>
					<Grid container justifyContent="flex-end">
						<Grid item>
							<Link style={{ color: '#648381' }} to="/dock" variant="body2">
								Go to docks
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

export default CreateDock;
