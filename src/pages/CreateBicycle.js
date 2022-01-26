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
import CategoryIcon from '@mui/icons-material/Category';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// import ImageUploader from '../components/ImageUploader';
import UserWindow from '../utils/UserWindow';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
// import categories from '../data/categories';

function Copyright() {
	return (
		<Typography
			paddingTop={5}
			variant="body2"
			color="text.secondary"
			align="center"
		>
			{`Products Online ${new Date().getFullYear()}.`}
		</Typography>
	);
}

const CreateProduct = () => {
	// const history = useHistory();
	const bicycleAPI = useBicycleRequest();
	const dockAPI = useDockRequest();
	const validationHook = useValidationHook();
	const [error, setError] = useState(null);
	const [codeError, setCodeError] = useState({ error: false, msg: '' });
	const [colorError, setColorError] = useState({ error: false, msg: '' });
	const [bicycleValues, setBicycleValues] = useState({
		Code: 0,
		Color: '',
		Status: 'ALL_GOOD',
		Client: null,
		Dock: 1111,
	});
	const screen = UserWindow();
	const [docks, setDocks] = useState([]);
	const [bicycleStatusList, setBicycleStatusList] = useState([]);

	const getBicycleStatusList = async () => {
		const statuses = await bicycleAPI.getBicycleStatuses();
		setBicycleStatusList(statuses);
	};

	const getDocksList = async () => {
		const docks = await dockAPI.getDocks();
		setDocks(docks);
	};

	useEffect(() => {
		getBicycleStatusList();
		getDocksList();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log(bicycleValues);
		if (!validationHook.isValidCode(bicycleValues.Code)) {
			console.log('valid error');
			setCodeError({
				error: true,
				msg: 'Code must be minimum 1000 or maximum 9999',
			});
		} else {
			setCodeError({ error: false, msg: '' });
		}
		if (!validationHook.isValidColor(bicycleValues.Color)) {
			setColorError({
				error: true,
				msg: 'Color must be minimum 3 and maximum 100 characters long',
			});
		} else {
			setColorError({ error: false, msg: '' });
		}
		if (
			validationHook.isValidColor(bicycleValues.Color) &&
			validationHook.isValidCode(bicycleValues.Code)
		) {
			submitData(bicycleValues);
		}
	};

	const submitData = async (bicycleData) => {
		console.log('request : ', bicycleData);
		const newBicycle = await bicycleAPI.createBicycle(bicycleData);
		console.log('response: ', newBicycle);
		setBicycleValues({
			Code: 0,
			Color: '',
			Status: 'ALL_GOOD',
			Client: null,
			Dock: 1111,
		});
	};

	const handleChange = (event) => {
		event.preventDefault();
		setBicycleValues({
			...bicycleValues,
			[event.target.name]: event.target.value,
		});
	};

	console.log(docks);

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
					Create New Product
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
						<Grid item xs={12} sm={9}>
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
						<Grid item xs={12} sm={3}>
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
						<Grid item xs={12} sm={9}>
							<FormControl fullWidth>
								<InputLabel id="demo-simple-select-label">Status</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
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
						<Grid item xs={12} sm={3}>
							<FormControl fullWidth>
								<InputLabel id="demo-simple-select-label">Dock</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={bicycleValues.Dock}
									name="Dock"
									label="Dock"
									onChange={handleChange}
								>
									<MenuItem value={1111}>One</MenuItem>
									<MenuItem value={2222}>Two</MenuItem>
									<MenuItem value={3333}>Three</MenuItem>
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
						Create Product
					</Button>
					<Grid container justifyContent="flex-end">
						<Grid item>
							<Link
								style={{ color: '#648381' }}
								to="/materials"
								variant="body2"
							>
								Go to products
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
