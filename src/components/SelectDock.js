import React, { useEffect, useState } from 'react';
import useDockRequest from '../api/useDockRequest';
import { DataGrid } from '@mui/x-data-grid';
import LoadingPage from './LoadingPage';
import { Container, Box, Typography } from '@mui/material';

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

export default function SelectDock(props) {
	const { setBicyclesReturnDock, numberOfBicycles, setOpenSelectDockDialog } =
		props;
	const userScreenHeight = window.innerHeight;
	const [loading, setLoading] = useState(true);
	const [rows, setRows] = useState([]);
	const dockAPI = useDockRequest();

	const displayDocks = async () => {
		const docks = await dockAPI.getDocks();
		const filteredDocks = docks.filter(
			(dock) => dock.BicycleDockNumber - dock.BicycleCount >= numberOfBicycles
		);
		filteredDocks.forEach(function (element, index) {
			element.id = index + 1;
		});
		setRows(filteredDocks);
		setLoading(false);
	};

	useEffect(() => {
		displayDocks();
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
				Select dock by clicking the row
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
						onRowClick={(props) => {
							setBicyclesReturnDock(props.row.Code);
							setOpenSelectDockDialog(false);
						}}
						pageSize={7}
						rowsPerPageOptions={[7]}
					/>
				</div>
			</Container>
		</Box>
	);
}
