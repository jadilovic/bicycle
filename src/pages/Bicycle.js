import React, { useEffect, useState, useRef } from 'react';
import UserWindow from '../utils/UserWindow';
import { getUserData } from '../auth/Authentication';
import useBicycleRequest from '../api/useBicycleRequest';
import usePersonRequest from '../api/usePersonRequest';
import useDockRequest from '../api/useDockRequest';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingPage from '../components/LoadingPage';
import {
	Container,
	Box,
	Button,
	Typography,
	Select,
	MenuItem,
	Grid,
	IconButton,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SelectDock from '../components/SelectDock';

export default function Bicycle() {
	const screen = UserWindow();
	const userScreenHeight = window.innerHeight;
	const [loading, setLoading] = useState(true);
	const [rows, setRows] = useState([]);
	const bicycleAPI = useBicycleRequest();
	const personAPI = usePersonRequest();
	const dockAPI = useDockRequest();
	const [bicycle, setBicycle] = useState({});
	const [status, setStatus] = useState('');
	const [bicycleStatuses, setBicycleStatuses] = useState([]);
	const user = getUserData();
	const isMounted = useRef(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [openSelectDockDialog, setOpenSelectDockDialog] = useState(false);
	const [rentedBicycles, setRentedBicycles] = useState([]);
	const [isPedaling, setIsPedaling] = useState(false);
	const [bicyclesReturnDock, setBicyclesReturnDock] = useState(0);

	const handleDialogClose = () => {
		setOpenDialog(false);
	};

	const handleSelectDockDialogClose = () => {
		setOpenSelectDockDialog(false);
	};

	function getClient(params) {
		return `${params.row.Client ? params.row.Client : 'None'}`;
	}

	function getBicycleStatus(params) {
		const bicycleStatus = bicycleStatuses.find(
			(status) => status.EnumName === params.row.Status
		);
		return bicycleStatus.Title;
	}

	const handleBicycleStatusChange = (event) => {
		event.preventDefault();
		setStatus(event.target.value);
	};

	const modifyBicycle = async () => {
		delete bicycle.id;
		bicycle.Status = status;
		const modifiedBicycle = await bicycleAPI.modifyBicycle(bicycle);
		displayBicycles();
	};

	useEffect(() => {
		if (isMounted.current) {
			console.log('changed STATUS test ', bicyclesReturnDock);
			modifyBicycle();
			setLoading(true);
		} else {
			//		isMounted.current = true;
		}
	}, [status]);

	useEffect(() => {
		if (isMounted.current) {
			setLoading(true);
			console.log('changed DOCK test ', bicyclesReturnDock);
			returnBicyclesToDock(bicyclesReturnDock);
		} else {
			isMounted.current = true;
		}
	}, [bicyclesReturnDock]);

	const isClient = () => {
		if (user.Role === 'CLIENT') {
			return true;
		} else {
			return false;
		}
	};

	const modifyBicycleRent = async (bicycle) => {
		// Remove dock code and add client code to rented bicycle
		delete bicycle.id;
		bicycle.Dock = null;
		bicycle.Client = user.Code;
		console.log(bicycle);
		const modifiedBicycle = await bicycleAPI.modifyBicycle(bicycle);
		console.log(modifiedBicycle);
		// Add rented bicycle to a list of rented bicycles
		rentedBicycles.push(modifiedBicycle);
		setRentedBicycles([...rentedBicycles]);
		modifyPersonRent();
	};

	const modifyPersonRent = async () => {
		// Add new bicycle to client
		user.BicycleCount = user.BicycleCount + 1;
		console.log('before api request : ', user);
		const modifiedPerson = await personAPI.modifyPerson(user);
		console.log('before saving local storage user : ', modifiedPerson);
		localStorage.setItem('user', JSON.stringify(modifiedPerson));
		localStorage.setItem('rentedBicycles', JSON.stringify(rentedBicycles));
		console.log(modifiedPerson);
		displayBicycles();
	};

	const modifyDockRent = async (bicycle) => {
		// Remove rented bicycle from a dock
		setLoading(true);
		console.log(bicycle);
		const dockList = await dockAPI.getDocks();
		console.log(dockList);
		const selectedDock = dockList.find((dock) => dock.Code === bicycle.Dock);
		console.log(selectedDock);
		const dockBicyclesCount = selectedDock.BicycleCount;
		selectedDock.BicycleCount = dockBicyclesCount - 1;
		const modifiedDock = await dockAPI.modifyDock(selectedDock);
		console.log(modifiedDock);
		modifyBicycleRent(bicycle);
	};

	const modifyBicycleReturn = async (bicycle, returnDock, arrLength, index) => {
		delete bicycle.id;
		bicycle.Dock = returnDock;
		bicycle.Client = null;
		console.log(bicycle);
		const modifiedBicycle = await bicycleAPI.modifyBicycle(bicycle);
		console.log(modifiedBicycle);
		if (arrLength === index + 1) {
			displayBicycles();
		}
		modifyPersonReturn();
	};

	const modifyPersonReturn = async () => {
		user.BicycleCount = user.BicycleCount - 1;
		console.log(user);
		const modifiedPerson = await personAPI.modifyPerson(user);
		localStorage.setItem('user', JSON.stringify(modifiedPerson));
		localStorage.removeItem('rentedBicycles');
		localStorage.removeItem('isPedaling');
		setRentedBicycles([]);
		setIsPedaling(false);
		console.log(modifiedPerson);
		// displayBicycles();
	};

	const modifyDockReturn = async (bicycle, returnDock, arrLength, index) => {
		console.log(bicycle);
		const dockList = await dockAPI.getDocks();
		console.log(dockList);
		const selectedDock = dockList.find((dock) => dock.Code === returnDock);
		console.log(selectedDock);
		selectedDock.BicycleCount = selectedDock.BicycleCount + 1;
		const modifiedDock = await dockAPI.modifyDock(selectedDock);
		console.log(modifiedDock);
		modifyBicycleReturn(bicycle, returnDock, arrLength, index);
	};

	const handleRent = (bicycle) => {
		if (user.BicycleCount === 50) {
			setOpenDialog(true);
		} else if (user.Role === 'APPADMIN') {
			alert('Admin is not allowed to rent bicycles');
		} else {
			modifyDockRent(bicycle);
		}
	};

	const displayBicycles = async () => {
		const bicycles = await bicycleAPI.getBicycles();
		console.log(bicycles);
		bicycles.forEach(function (element, index) {
			element.id = index + 1;
		});
		setRows(bicycles);
		setLoading(false);
	};

	const returnBicyclesToDock = async (dockCode) => {
		console.log(rentedBicycles);
		for (let index = 0; index < rentedBicycles.length; index++) {
			await modifyDockReturn(
				rentedBicycles[index],
				dockCode,
				rentedBicycles.length,
				index
			);
		}
	};

	// ONLY USED IN DEVELOPMENT
	// const emptyDock = async (dock) => {
	// 	if (dock.Code === 4444) {
	// 		dock.BicycleCount = 0;
	// 		dock.BicycleDockNumber = 2;
	// 	} else {
	// 		dock.BicycleCount = 0;
	// 	}
	// 	const modifiedDock = await dockAPI.modifyDock(dock);
	// 	console.log(modifiedDock);
	// };

	// const emptyDocks = async () => {
	// 	const dockList = await dockAPI.getDocks();
	// 	for (let index = 0; index < dockList.length; index++) {
	// 		await emptyDock(dockList[index]);
	// 	}
	// };

	// const emptyClient = async (client) => {
	// 	if (client.Code === 6689) {
	// 		client.BicycleCount = 50;
	// 	} else {
	// 		client.BicycleCount = 0;
	// 	}
	// 	const modifiedClient = await personAPI.modifyPerson(client);
	// 	console.log(modifiedClient);
	// };

	// const emptyClients = async () => {
	// 	const clientList = await personAPI.getPersons();
	// 	for (let index = 0; index < clientList.length; index++) {
	// 		await emptyClient(clientList[index]);
	// 	}
	// };
	// ONLY USED IN DEVELOPMENT

	const getBicycleStatuses = async (rentedBicycles, isPedaling) => {
		const bicycleStatuses = await bicycleAPI.getBicycleStatuses();
		setBicycleStatuses(bicycleStatuses);
		console.log('bicycle statuses start : ', rentedBicycles.length, isPedaling);

		if (rentedBicycles.length > 0 && isPedaling) {
			console.log('start pedaling test');
			startPedaling(rentedBicycles);
		} else {
			displayBicycles();
		}
		console.log('bicycle statuses end : ', rentedBicycles.length, isPedaling);
	};

	useEffect(() => {
		const localStorageRentedBicycles = JSON.parse(
			localStorage.getItem('rentedBicycles') || '[]'
		);
		if (localStorageRentedBicycles) {
			setRentedBicycles(localStorageRentedBicycles);
		}
		const localStorageIsPedaling = JSON.parse(
			localStorage.getItem('isPedaling')
		);
		if (localStorageIsPedaling) {
			setIsPedaling(localStorageIsPedaling);
		}
		getBicycleStatuses(localStorageRentedBicycles, localStorageIsPedaling);
	}, []);

	const startPedaling = (rentedBicycles) => {
		if (user.Role === 'APPADMIN') {
			alert('Admin is not allowed to rent or start pedaling!');
			displayBicycles();
		} else {
			setLoading(true);
			console.log('test : ', rentedBicycles);
			rentedBicycles.forEach(function (element, index) {
				element.id = index + 1;
			});
			setIsPedaling(true);
			localStorage.setItem('isPedaling', true);
			setRows(rentedBicycles);
			setLoading(false);
		}
	};

	const stopPedaling = () => {
		if (user.Role === 'APPADMIN') {
			alert('Admin is not allowed to use Client options!');
		} else {
			setOpenSelectDockDialog(true);
		}
	};

	const deleteBicycle = async (bicycleObject) => {
		setLoading(true);
		console.log('delete bicycle : ', bicycleObject);
		const deletedBicycle = await bicycleAPI.deleteBicycle(bicycleObject.Code);
		console.log('deleted bicycle : ', deletedBicycle);
		const docksList = await dockAPI.getDocks();
		const dockObject = docksList.find(
			(dock) => dock.Code === bicycleObject.Dock
		);
		console.log('to be modified dock : ', dockObject);
		dockObject.BicycleCount = dockObject.BicycleCount - 1;
		const modifiedDock = await dockAPI.modifyDock(dockObject);
		console.log('modified dock after delet : ', modifiedDock);
		displayBicycles();
	};

	const columns = [
		{ field: 'id', headerName: 'ID', flex: 1, hide: true },
		{ field: 'Code', headerName: 'Code', flex: 1 },
		{ field: 'Color', headerName: 'Color', flex: 1 },
		{
			field: 'Status',
			headerName: 'Status',
			width: 165,
			valueGetter: isClient() ? getBicycleStatus : null,
			renderCell: isClient()
				? null
				: (params) => (
						<Select
							style={{ width: 165 }}
							value={params.value}
							onChange={handleBicycleStatusChange}
							onClick={() => setBicycle(params.row)}
						>
							<MenuItem value="ALL_GOOD">All good</MenuItem>
							<MenuItem value="LITTLE_DAMAGE">Little damage</MenuItem>
							<MenuItem value="WRECKED">Wrecked</MenuItem>
						</Select>
				  ),
		},
		{
			field: 'Client',
			headerName: 'Client',
			flex: 1,
			align: 'center',
			hide: isClient(),
			valueGetter: getClient,
		},
		{
			field: 'Dock',
			headerName: 'Dock',
			flex: 1,
			align: 'center',
			renderCell: (params) => (
				<strong>
					<Button
						disabled={params.value ? false : true}
						variant="contained"
						color="primary"
						size="small"
						style={{ marginLeft: 16 }}
						onClick={() => handleRent(params.row)}
					>
						{params.value ? 'Rent from ' + params.value : 'Rented bicycle'}
					</Button>
				</strong>
			),
		},
		{
			field: 'Delete',
			headerName: 'Delete',
			flex: 1,
			align: 'center',
			hide: isClient(),
			renderCell: (params) => (
				<strong>
					<IconButton
						disabled={
							params.row.Status !== 'WRECKED' || params.row.Dock === null
						}
						aria-label="delete"
						color="error"
						style={{ marginLeft: 16 }}
						onClick={() => deleteBicycle(params.row)}
					>
						<DeleteIcon />
					</IconButton>
				</strong>
			),
		},
	];

	console.log(rentedBicycles.length === 0 || isPedaling);

	if (loading) {
		return <LoadingPage />;
	}

	return (
		<Box
			component="main"
			sx={{
				flexGrow: 1,
				marginTop: 8,
				paddingLeft: screen.dynamicWidth < 600 ? 0 : 25,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<Container maxWidth="lg">
				<Grid
					justify="space-between"
					container
					sx={{ paddingTop: 1, paddingBottom: 1 }}
				>
					<Grid item xs={4} container>
						<Typography component="h6" variant="h6">
							Bicycles list
						</Typography>
					</Grid>
					<Grid item xs={4} container justifyContent="flex">
						<Button
							disabled={rentedBicycles.length === 0 || isPedaling}
							variant="contained"
							color="warning"
							size="small"
							style={{ marginLeft: 16 }}
							onClick={() => startPedaling(rentedBicycles)}
						>
							Start pedaling
						</Button>
					</Grid>
					<Grid item xs={4} container justifyContent="flex-end">
						<Button
							disabled={rentedBicycles.length === 0 || !isPedaling}
							variant="contained"
							color="error"
							size="small"
							style={{ marginLeft: 16 }}
							onClick={() => stopPedaling()}
						>
							Stop pedaling
						</Button>
					</Grid>
				</Grid>
				<div
					style={{
						height: userScreenHeight - 112,
						width: '100%',
						//	cursor: 'pointer',
					}}
				>
					<DataGrid
						rows={rows}
						columns={columns}
						pageSize={7}
						rowsPerPageOptions={[7]}
					/>
				</div>
			</Container>
			<div>
				<Dialog open={openDialog} onClose={handleDialogClose}>
					<DialogTitle>{'Maximum number of bicycles reached!'}</DialogTitle>
					<DialogContent>
						<DialogContentText>
							You have reached maximum number of bicycles that you can rent! You
							have to return rented bicycles before you can rent new ones.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleDialogClose} autoFocus>
							OK
						</Button>
					</DialogActions>
				</Dialog>
			</div>
			<div>
				<Dialog
					fullWidth={true}
					maxWidth="lg"
					open={openSelectDockDialog}
					onClose={handleSelectDockDialogClose}
				>
					<DialogContent>
						<SelectDock
							setBicyclesReturnDock={setBicyclesReturnDock}
							numberOfBicycles={rentedBicycles.length}
							setOpenSelectDockDialog={setOpenSelectDockDialog}
						/>
					</DialogContent>
					<DialogActions>
						<Button
							variant="contained"
							onClick={handleSelectDockDialogClose}
							autoFocus
						>
							Back
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		</Box>
	);
}
