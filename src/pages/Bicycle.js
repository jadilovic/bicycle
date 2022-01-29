import React, { useEffect, useState, useRef } from 'react';
import UserWindow from '../utils/UserWindow';
import { getUserData } from '../auth/Authentication';
import useBicycleRequest from '../api/useBicycleRequest';
import usePersonRequest from '../api/usePersonRequest';
import useDockRequest from '../api/useDockRequest';
import { DataGrid } from '@mui/x-data-grid';
import LoadingPage from '../components/LoadingPage';
import {
	Container,
	Box,
	Button,
	Typography,
	Select,
	MenuItem,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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

	const handleDialogClose = () => {
		setOpenDialog(false);
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
			modifyBicycle();
			setLoading(true);
		} else {
			isMounted.current = true;
		}
	}, [status]);

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
		console.log(bicycle);
		const modifiedBicycle = await bicycleAPI.modifyBicycle(bicycle);
		console.log(modifiedBicycle);
		modifyPersonRent();
	};

	const modifyPersonRent = async () => {
		const userBicycleCount = user.BicycleCount;
		user.BicycleCount = userBicycleCount + 1;
		console.log(user);
		const modifiedPerson = await personAPI.modifyPerson(user);
		localStorage.setItem('user', JSON.stringify(modifiedPerson));
		console.log(modifiedPerson);
		displayBicycles();
	};

	const modifyDockRent = async (bicycle) => {
		console.log(bicycle);
		const dockList = await dockAPI.getDocks();
		console.log(dockList);
		const selectedDock = dockList.find((dock) => dock.Code === bicycle.Dock);
		console.log(selectedDock);
		const dockBicyclesCount = selectedDock.BicycleCount;
		selectedDock.BicycleCount = dockBicyclesCount - 1;
		const modifiedDock = dockAPI.modifyDock(selectedDock);
		console.log(modifiedDock);
		modifyBicycleRent(bicycle);
	};

	const handleRent = (bicycle) => {
		if (user.BicycleCount === 50) {
			setOpenDialog(true);
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

	const getBicycleStatuses = async () => {
		const bicycleStatuses = await bicycleAPI.getBicycleStatuses();
		setBicycleStatuses(bicycleStatuses);
		displayBicycles();
	};

	useEffect(() => {
		getBicycleStatuses();
	}, []);

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
			<Typography component="h6" variant="h6">
				Bicycles list
			</Typography>
			<Container maxWidth="md">
				<div
					style={{
						height: userScreenHeight - 112,
						width: '100%',
						cursor: 'pointer',
					}}
				>
					<DataGrid
						rows={rows}
						columns={columns}
						// pageSize={5}
						// rowsPerPageOptions={[5]}
					/>
				</div>
			</Container>
			<div>
				<Dialog
					open={openDialog}
					onClose={handleDialogClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						{'Maximum number of bicycles reached!'}
					</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
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
		</Box>
	);
}
