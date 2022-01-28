import React, { useEffect, useState } from 'react';
import UserWindow from '../utils/UserWindow';
import { getUserData } from '../auth/Authentication';
import useBicycleRequest from '../api/useBicycleRequest';
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

export default function Bicycle() {
	const screen = UserWindow();

	const userScreenHeight = window.innerHeight;
	const [loading, setLoading] = useState(true);
	const [rows, setRows] = useState([]);
	const bicycleAPI = useBicycleRequest();
	const [bicycleStatus, setBicycleStatus] = useState('');
	const user = getUserData();

	const handleChange = (event) => {
		setBicycleStatus(event.target.value);
	};

	const isClient = () => {
		if (user.Role === 'CLIENT') {
			return true;
		} else {
			return false;
		}
	};

	const handleRent = async (bicycle, dockCode) => {
		delete bicycle.id;
		bicycle.Dock = null;
		bicycle.Client = user.Code;
		console.log(bicycle);
		const modifiedBicycle = await bicycleAPI.modifyBicycle(bicycle);
		console.log(modifiedBicycle);
	};

	const columns = [
		{ field: 'id', headerName: 'ID', flex: 1, hide: true },
		{ field: 'Code', headerName: 'Code', flex: 1 },
		{ field: 'Color', headerName: 'Color', flex: 1 },
		{
			field: 'Status',
			headerName: 'Status',
			width: 165,
			renderCell: (params) => (
				<Select
					style={{ width: 165 }}
					value={params.value}
					onChange={handleChange}
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
		},
		{
			field: 'Dock',
			headerName: 'Dock',
			flex: 1,
			align: 'center',
			renderCell: (params) => (
				<strong>
					{params.value && (
						<Button
							variant="contained"
							color="primary"
							size="small"
							style={{ marginLeft: 16 }}
							onClick={() => handleRent(params.row, params.value)}
						>
							Rent {params.value}
						</Button>
					)}
				</strong>
			),
		},
	];

	const displayBicycles = async () => {
		const bicycles = await bicycleAPI.getBicycles();
		bicycles.forEach(function (element, index) {
			element.id = index + 1;
		});
		setRows(bicycles);
		setLoading(false);
	};

	useEffect(() => {
		displayBicycles();
	}, []);

	console.log(bicycleStatus);

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
		</Box>
	);
}
