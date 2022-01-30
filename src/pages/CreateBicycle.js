import React, { useState, useEffect } from 'react';
import useBicycleRequest from '../api/useBicycleRequest';
import useDockRequest from '../api/useDockRequest';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import useValidationHook from '../utils/useValidationHook';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Box, Alert } from '@mui/material';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import UserWindow from '../utils/UserWindow';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import LoadingPage from '../components/LoadingPage';

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
	const bicycleAPI = useBicycleRequest();
	const dockAPI = useDockRequest();
	const validationHook = useValidationHook();
	const [error, setError] = useState(null);
	const [codeError, setCodeError] = useState({ error: false, msg: '' });
	const [colorError, setColorError] = useState({ error: false, msg: '' });
	const [bicycleValues, setBicycleValues] = useState({
		Code: '',
		Color: '',
		Status: '',
		Client: '',
		Dock: '',
	});
	const screen = UserWindow();
	const [docks, setDocks] = useState([]);
	const [bicycleStatusList, setBicycleStatusList] = useState([]);
	const [loading, setLoading] = useState(true);

	const getBicycleStatusList = async () => {
		const statuses = await bicycleAPI.getBicycleStatuses();
		setBicycleStatusList(statuses);
		getDocksList(statuses);
	};

	const getDocksList = async (statuses) => {
		const docks = await dockAPI.getDocks();
		const availableDocks = docks.filter(
			(dock) => dock.BicycleDockNumber > dock.BicycleCount
		);
		setDocks(availableDocks);
		setBicycleValues({
			...bicycleValues,
			Status: statuses[0].EnumName,
			Dock: docks[0].Code,
		});
	};

	useEffect(() => {
		setLoading(false);
	}, [bicycleValues]);

	useEffect(() => {
		getBicycleStatusList();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log(bicycleValues);
		if (validationHook.codeError(bicycleValues.Code)) {
			setCodeError(validationHook.codeError(bicycleValues.Code));
		} else {
			setCodeError({ error: false, msg: '' });
		}
		if (validationHook.colorError(bicycleValues.Color)) {
			setColorError(validationHook.colorError(bicycleValues.Color));
		} else {
			setColorError({ error: false, msg: '' });
		}
		if (
			!validationHook.colorError(bicycleValues.Color) &&
			!validationHook.codeError(bicycleValues.Code)
		) {
			submitData(bicycleValues);
		}
	};

	const modifyDock = async (dockCode) => {
		const selectedDock = docks.find((dock) => dock.Code === dockCode);
		selectedDock.BicycleCount = selectedDock.BicycleCount + 1;
		const modifiedDock = await dockAPI.modifyDock(selectedDock);
		console.log('modified dock : ', modifiedDock);
	};

	const submitData = async (bicycleData) => {
		console.log('request : ', bicycleData);
		const newBicycle = await bicycleAPI.createBicycle(bicycleData);
		modifyDock(newBicycle.Dock);
		console.log('response: ', newBicycle);
		setBicycleValues({
			Code: '',
			Color: '',
			Status: '',
			Client: '',
			Dock: '',
		});
	};

	const handleChange = (event) => {
		event.preventDefault();
		setBicycleValues({
			...bicycleValues,
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
					<PedalBikeIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Create New Bicycle
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
								error={colorError.error ? true : false}
								helperText={colorError?.msg}
								name="Color"
								required
								fullWidth
								id="Color"
								label="Color"
								autoFocus
								value={bicycleValues.Color}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								error={codeError?.error ? true : false}
								helperText={codeError?.msg}
								required
								fullWidth
								id="Code"
								label="Code"
								name="Code"
								type="number"
								value={bicycleValues.Code}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<FormControl fullWidth>
								<InputLabel>Status</InputLabel>
								<Select
									value={bicycleValues.Status}
									label="Status"
									name="Status"
									onChange={handleChange}
								>
									{bicycleStatusList.map((status, index) => {
										return (
											<MenuItem key={index} value={status.EnumName}>
												{status.Title}
											</MenuItem>
										);
									})}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<FormControl fullWidth>
								<InputLabel>Dock</InputLabel>
								<Select
									value={bicycleValues.Dock}
									name="Dock"
									label="Dock"
									onChange={handleChange}
								>
									{docks.map((dock, index) => {
										return (
											<MenuItem key={index} value={dock.Code}>
												{`${dock.Code} - ${dock.Address}, ${dock.City}, ${dock.State}`}
											</MenuItem>
										);
									})}
								</Select>
							</FormControl>
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
							<Link style={{ color: '#648381' }} to="/bicycle" variant="body2">
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
