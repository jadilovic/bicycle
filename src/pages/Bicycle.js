import React, { useEffect, useState, useRef } from 'react';
import UserWindow from '../utils/UserWindow';
import { getUserData } from '../auth/Authentication';
import useBicycleRequest from '../api/useBicycleRequest';
import usePersonRequest from '../api/usePersonRequest';
import useDockRequest from '../api/useDockRequest';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import ClientInfo from '../components/ClientInfo';
import DockInfo from '../components/DockInfo';
import LoadingPage from '../components/LoadingPage';
import ConfirmDialog from '../components/ConfirmDialog';
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
	const [openAdminDialog, setOpenAdminDialog] = useState(false);
	const [openSelectDockDialog, setOpenSelectDockDialog] = useState(false);
	const [openClientInfoDialog, setOpenClientInfoDialog] = useState(false);
	const [openDockInfoDialog, setOpenDockInfoDialog] = useState(false);
	const [rentedBicycles, setRentedBicycles] = useState([]);
	const [isPedaling, setIsPedaling] = useState(false);
	const [bicyclesReturnDock, setBicyclesReturnDock] = useState(0);
	const [clientCode, setClientCode] = useState(0);
	const [dockCode, setDockCode] = useState(0);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [selectedBicycle, setSelectedBicycle] = useState({});

	const handleDialogClose = () => {
		setOpenDialog(false);
	};

	const handleAdminDialogClose = () => {
		setOpenAdminDialog(false);
	};

	const handleSelectDockDialogClose = () => {
		setOpenSelectDockDialog(false);
	};

	const handleClientInfoDialogClose = () => {
		setOpenClientInfoDialog(false);
	};

	const handleDockInfoDialogClose = () => {
		setOpenDockInfoDialog(false);
	};

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
		await bicycleAPI.modifyBicycle(bicycle);
		displayBicycles();
	};

	useEffect(() => {
		if (isMounted.current) {
			modifyBicycle();
			setLoading(true);
		}
	}, [status]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (isMounted.current) {
			setLoading(true);
			returnBicyclesToDock(bicyclesReturnDock);
		} else {
			isMounted.current = true;
		}
	}, [bicyclesReturnDock]); // eslint-disable-line react-hooks/exhaustive-deps

	const isClient = () => {
		if (user.Role === 'CLIENT') {
			return true;
		} else {
			return false;
		}
	};

	const modifyBicycleRent = async (bicycle) => {
		delete bicycle.id;
		bicycle.Dock = null;
		bicycle.Client = user.Code;
		const modifiedBicycle = await bicycleAPI.modifyBicycle(bicycle);
		rentedBicycles.push(modifiedBicycle);
		setRentedBicycles([...rentedBicycles]);
		modifyPersonRent();
	};

	const modifyPersonRent = async () => {
		user.BicycleCount = user.BicycleCount + 1;
		const modifiedPerson = await personAPI.modifyPerson(user);
		localStorage.setItem('user', JSON.stringify(modifiedPerson));
		localStorage.setItem('rentedBicycles', JSON.stringify(rentedBicycles));
		displayBicycles();
	};

	const modifyDockRent = async (bicycle) => {
		setLoading(true);
		const dockList = await dockAPI.getDocks();
		const selectedDock = dockList.find((dock) => dock.Code === bicycle.Dock);
		const dockBicyclesCount = selectedDock.BicycleCount;
		selectedDock.BicycleCount = dockBicyclesCount - 1;
		await dockAPI.modifyDock(selectedDock);
		modifyBicycleRent(bicycle);
	};

	const modifyBicycleReturn = async (bicycle, returnDock, arrLength, index) => {
		delete bicycle.id;
		bicycle.Dock = returnDock;
		bicycle.Client = null;
		await bicycleAPI.modifyBicycle(bicycle);
		if (arrLength === index + 1) {
			displayBicycles();
		}
		modifyPersonReturn();
	};

	const modifyPersonReturn = async () => {
		user.BicycleCount = user.BicycleCount - 1;
		const modifiedPerson = await personAPI.modifyPerson(user);
		localStorage.setItem('user', JSON.stringify(modifiedPerson));
		localStorage.removeItem('rentedBicycles');
		localStorage.removeItem('isPedaling');
		setRentedBicycles([]);
		setIsPedaling(false);
	};

	const modifyDockReturn = async (bicycle, returnDock, arrLength, index) => {
		const dockList = await dockAPI.getDocks();
		const selectedDock = dockList.find((dock) => dock.Code === returnDock);
		selectedDock.BicycleCount = selectedDock.BicycleCount + 1;
		await dockAPI.modifyDock(selectedDock);
		modifyBicycleReturn(bicycle, returnDock, arrLength, index);
	};

	const handleRent = (bicycle) => {
		if (user.BicycleCount === 50) {
			setOpenDialog(true);
		} else if (user.Role === 'APPADMIN') {
			setOpenAdminDialog(true);
		} else {
			modifyDockRent(bicycle);
		}
	};

	const displayBicycles = async () => {
		const bicycles = await bicycleAPI.getBicycles();
		bicycles.forEach(function (element, index) {
			element.id = index + 1;
		});
		setRows(bicycles);
		setLoading(false);
	};

	const returnBicyclesToDock = async (dockCode) => {
		for (let index = 0; index < rentedBicycles.length; index++) {
			await modifyDockReturn(
				rentedBicycles[index],
				dockCode,
				rentedBicycles.length,
				index
			);
		}
	};

	const getBicycleStatuses = async (rentedBicycles, isPedaling) => {
		const statuses = await bicycleAPI.getBicycleStatuses();
		setBicycleStatuses(statuses);
		if (user.Role === 'APPADMIN') {
			isPedaling = false;
		}
		if (rentedBicycles.length > 0 && isPedaling) {
			startPedaling(rentedBicycles);
		} else {
			displayBicycles();
		}
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
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const startPedaling = (rentedBicycles) => {
		if (user.Role === 'APPADMIN') {
			setOpenAdminDialog(true);
			displayBicycles();
		} else {
			setLoading(true);
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
			setOpenAdminDialog(true);
		} else {
			setOpenSelectDockDialog(true);
		}
	};

	const deleteBicycle = async (bicycleObject) => {
		setLoading(true);
		await bicycleAPI.deleteBicycle(bicycleObject.Code);
		const docksList = await dockAPI.getDocks();
		const dockObject = docksList.find(
			(dock) => dock.Code === bicycleObject.Dock
		);
		dockObject.BicycleCount = dockObject.BicycleCount - 1;
		await dockAPI.modifyDock(dockObject);
		displayBicycles();
	};

	const handleDeleteBicycle = (bicycleObject) => {
		setSelectedBicycle(bicycleObject);
		setConfirmOpen(true);
	};

	const handleClient = async (clientCode) => {
		setClientCode(clientCode);
		setOpenClientInfoDialog(true);
	};

	const handleDock = async (dockCode) => {
		setDockCode(dockCode);
		setOpenDockInfoDialog(true);
	};

	const columns = [
		{ field: 'id', headerName: 'ID', flex: 1, hide: true },
		{
			field: 'Code',
			headerName: 'Code',
			flex: 1,
			renderCell: (params) => (
				<strong>
					<Button
						disabled={params.row.Dock ? false : true}
						variant="contained"
						color="primary"
						size="small"
						style={{ marginLeft: 16 }}
						onClick={() => handleRent(params.row)}
					>
						{'Rent ' + params.value}
					</Button>
				</strong>
			),
		},
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
							variant="standard"
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
			//	valueGetter: getClient,
			renderCell: (params) => (
				<strong>
					<Button
						disabled={params.value ? false : true}
						variant="contained"
						color="primary"
						size="small"
						style={{ marginLeft: 16 }}
						onClick={() => handleClient(params.row.Client)}
					>
						{params.value ? params.value : 'None'}
					</Button>
				</strong>
			),
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
						onClick={() => handleDock(params.row.Dock)}
					>
						{params.value ? params.value : 'Rented'}
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
						onClick={() => handleDeleteBicycle(params.row)}
					>
						<DeleteIcon />
					</IconButton>
				</strong>
			),
		},
	];

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
						<Button variant="contained" onClick={handleDialogClose} autoFocus>
							OK
						</Button>
					</DialogActions>
				</Dialog>
			</div>
			<div>
				<Dialog open={openAdminDialog} onClose={handleAdminDialogClose}>
					<DialogTitle>{'Action not allowed!'}</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Administrator is not allowed to rent bicycles, start pedaling or
							stop pedaling.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							variant="contained"
							onClick={handleAdminDialogClose}
							autoFocus
						>
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
			<div>
				<Dialog
					fullWidth={true}
					maxWidth="lg"
					open={openClientInfoDialog}
					onClose={handleClientInfoDialogClose}
				>
					<DialogContent>
						<ClientInfo clientCode={clientCode} />
					</DialogContent>
					<DialogActions>
						<Button
							variant="contained"
							onClick={handleClientInfoDialogClose}
							autoFocus
						>
							Back
						</Button>
					</DialogActions>
				</Dialog>
			</div>
			<div>
				<Dialog
					fullWidth={true}
					maxWidth="lg"
					open={openDockInfoDialog}
					onClose={handleDockInfoDialogClose}
				>
					<DialogContent>
						<DockInfo dockCode={dockCode} />
					</DialogContent>
					<DialogActions>
						<Button
							variant="contained"
							onClick={handleDockInfoDialogClose}
							autoFocus
						>
							Back
						</Button>
					</DialogActions>
				</Dialog>
			</div>
			<div>
				<ConfirmDialog
					deleteBicycle={deleteBicycle}
					selectedBicycle={selectedBicycle}
					setConfirmOpen={setConfirmOpen}
					confirmOpen={confirmOpen}
				/>
			</div>
		</Box>
	);
}
