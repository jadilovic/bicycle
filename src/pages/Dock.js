import React, { useEffect, useState } from 'react';
import UserWindow from '../utils/UserWindow';
import useDockRequest from '../api/useDockRequest';
import { DataGrid } from '@mui/x-data-grid';
import LoadingPage from '../components/LoadingPage';
import { Container, Box, Button, Typography } from '@mui/material';

const columns = [
	{ field: 'id', headerName: 'ID', flex: 1, hide: true },
	{ field: 'Code', headerName: 'Code', width: 70 },
	{ field: 'State', headerName: 'State', flex: 1 },
	{ field: 'City', headerName: 'City', flex: 1 },
	{ field: 'Address', headerName: 'Address', flex: 1 },
	{
		field: 'BicycleDockNumber',
		headerName: 'Bicycle dock number',
		flex: 1,
		align: 'center',
	},
	{
		field: 'BicycleCount',
		headerName: 'Bicycle count',
		flex: 1,
		align: 'center',
		renderCell: (params) => (
			<strong>
				{params.value >= 0 && (
					<Button
						variant="contained"
						color="primary"
						size="small"
						style={{ marginLeft: 16 }}
					>
						{params.value}
					</Button>
				)}
			</strong>
		),
	},
];

export default function Dock() {
	const screen = UserWindow();
	const userScreenHeight = window.innerHeight;
	const [loading, setLoading] = useState(true);
	const [rows, setRows] = useState([]);
	const dockAPI = useDockRequest();

	const displayDocks = async () => {
		const docks = await dockAPI.getDocks();
		docks.forEach(function (element, index) {
			element.id = index + 1;
		});
		setRows(docks);
		setLoading(false);
	};

	useEffect(() => {
		displayDocks();
	}, []);

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
				Docks list
			</Typography>
			<Container maxWidth="lg">
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
