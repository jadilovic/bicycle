import React, { useEffect, useState } from 'react';
import useDockRequest from '../api/useDockRequest';
import { DataGrid } from '@mui/x-data-grid';
import LoadingPage from './LoadingPage';
import { Container, Box, Typography } from '@mui/material';

export default function DockInfo(props) {
	const { dockCode } = props;
	const userScreenHeight = window.innerHeight;
	const [loading, setLoading] = useState(true);
	const [rows, setRows] = useState([]);
	const dockAPI = useDockRequest();

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
		},
	];

	const displayDocks = async () => {
		const docks = await dockAPI.getDocks();
		const filteredDock = docks.filter((dock) => dock.Code === dockCode);
		filteredDock.forEach(function (element, index) {
			element.id = index + 1;
		});
		setRows(filteredDock);
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
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<Typography component="h6" variant="h6">
				Dock Info
			</Typography>
			<Container maxWidth="lg">
				<div
					style={{
						height: userScreenHeight - 350,
						width: '100%',
						//	cursor: 'pointer',
					}}
				>
					<DataGrid
						rows={rows}
						columns={columns}
						pageSize={1}
						rowsPerPageOptions={[1]}
					/>
				</div>
			</Container>
		</Box>
	);
}
