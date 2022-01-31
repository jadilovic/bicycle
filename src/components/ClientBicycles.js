import React, { useEffect, useState } from 'react';
import UserWindow from '../utils/UserWindow';
import useBicycleRequest from '../api/useBicycleRequest';
import { DataGrid } from '@mui/x-data-grid';
import LoadingPage from './LoadingPage';
import { Container, Box, Button, Typography } from '@mui/material';

const columns = [
	{ field: 'id', headerName: 'ID', flex: 1, hide: true },
	{ field: 'Code', headerName: 'Code', flex: 1 },
	{ field: 'Color', headerName: 'Color', flex: 1 },
	{
		field: 'Status',
		headerName: 'Status',
		width: 165,
		//	valueGetter: isClient() ? getBicycleStatus : null,
	},
	{
		field: 'Client',
		headerName: 'Client',
		flex: 1,
		align: 'center',
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
					//	onClick={() => handleRent(params.row)}
				>
					{params.value ? 'Rent from ' + params.value : 'Rented bicycle'}
				</Button>
			</strong>
		),
	},
];

export default function ClientBicycles(props) {
	const { clientCode } = props;
	const screen = UserWindow();
	const userScreenHeight = window.innerHeight;
	const [loading, setLoading] = useState(true);
	const [rows, setRows] = useState([]);
	const bicycleAPI = useBicycleRequest();

	const displayBicycles = async () => {
		const bicycles = await bicycleAPI.getBicycles();
		const filteredBicycles = bicycles.filter(
			(bicycle) => bicycle.Client === clientCode
		);
		filteredBicycles.forEach(function (element, index) {
			element.id = index + 1;
		});
		setRows(filteredBicycles);
		setLoading(false);
	};

	useEffect(() => {
		displayBicycles();
	}, []);

	if (loading) {
		return <LoadingPage />;
	}

	return (
		<Box
			component="main"
			sx={{
				flexGrow: 1,
				// marginTop: 8,
				// paddingLeft: screen.dynamicWidth < 600 ? 0 : 25,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<Typography component="h6" variant="h6">
				List of bicycles rented by {clientCode}
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
						// onRowClick={(props) => {
						// 	console.log(props.row);
						// 	setBicyclesReturnDock(props.row.Code);
						// 	setOpenSelectDockDialog(false);
						// }}
						pageSize={7}
						rowsPerPageOptions={[7]}
					/>
				</div>
			</Container>
		</Box>
	);
}
