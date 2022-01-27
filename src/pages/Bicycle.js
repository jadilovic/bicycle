import React, { useEffect, useState } from 'react';
import UserWindow from '../utils/UserWindow';
import useBicycleRequest from '../api/useBicycleRequest';
import { DataGrid } from '@mui/x-data-grid';
import LoadingPage from '../components/LoadingPage';
import { Container, Box, Button, Typography } from '@mui/material';

const columns = [
	{ field: 'id', headerName: 'ID', flex: 1, hide: true },
	{ field: 'Code', headerName: 'Code', flex: 1 },
	{ field: 'Color', headerName: 'Color', flex: 1 },
	{ field: 'Status', headerName: 'Status', flex: 1 },
	{
		field: 'Client',
		headerName: 'Client',
		flex: 1,
	},
	{
		field: 'Dock',
		headerName: 'Dock',
		flex: 1,
		renderCell: (params) => (
			<strong>
				{params.value && (
					<Button
						variant="contained"
						color="primary"
						size="small"
						style={{ marginLeft: 16 }}
					>
						Rent
					</Button>
				)}
			</strong>
		),
	},
];

export default function Bicycle() {
	const screen = UserWindow();

	const userScreenHeight = window.innerHeight;
	const [loading, setLoading] = useState(true);
	const [rows, setRows] = useState([]);
	const bicycleAPI = useBicycleRequest();

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

	console.log(loading);

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
