import React, { useEffect, useState } from 'react';
import useBicycleRequest from '../api/useBicycleRequest';
import { DataGrid } from '@mui/x-data-grid';
import LoadingPage from './LoadingPage';
import { Container, Box, Typography } from '@mui/material';

const columns = [
	{ field: 'id', headerName: 'ID', flex: 1, hide: true },
	{ field: 'Code', headerName: 'Code', flex: 1 },
	{ field: 'Color', headerName: 'Color', flex: 1 },
	{
		field: 'Status',
		headerName: 'Status',
		width: 165,
	},
	{
		field: 'Dock',
		headerName: 'Dock',
		flex: 1,
		align: 'center',
	},
];

export default function ClientBicycles(props) {
	const { dockCode } = props;
	const userScreenHeight = window.innerHeight;
	const [loading, setLoading] = useState(true);
	const [rows, setRows] = useState([]);
	const bicycleAPI = useBicycleRequest();

	const displayBicycles = async () => {
		const bicycles = await bicycleAPI.getBicycles();
		const filteredBicycles = bicycles.filter(
			(bicycle) => bicycle.Dock === dockCode
		);
		filteredBicycles.forEach(function (element, index) {
			element.id = index + 1;
		});
		setRows(filteredBicycles);
		setLoading(false);
	};

	useEffect(() => {
		displayBicycles();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	if (loading) {
		return <LoadingPage />;
	}

	return (
		<Box
			component="main"
			sx={{
				flexGrow: 1,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<Typography component="h6" variant="h6">
				List of bicycles in dock {dockCode}
			</Typography>
			<Container maxWidth="lg">
				<div
					style={{
						height: userScreenHeight - 250,
						width: '100%',
						cursor: 'pointer',
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
		</Box>
	);
}
