import React, { useEffect, useState } from 'react';
import usePersonRequest from '../api/usePersonRequest';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import LoadingPage from './LoadingPage';
import { Container, Box, Typography } from '@mui/material';

export default function ClientInfo(props) {
	const { clientCode } = props;
	const userScreenHeight = window.innerHeight;
	const [loading, setLoading] = useState(true);
	const [rows, setRows] = useState([]);
	const personAPI = usePersonRequest();

	const displayPersons = async () => {
		const persons = await personAPI.getPersons();
		const filteredClient = persons.filter(
			(person) => person.Code === clientCode
		);
		filteredClient.forEach(function (element, index) {
			element.id = index + 1;
		});
		setRows(filteredClient);
		setLoading(false);
	};

	useEffect(() => {
		displayPersons();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	function getFullName(params) {
		return `${params.row.Name || ''} ${params.row.Surname || ''}`;
	}

	const columns = [
		{ field: 'id', headerName: 'ID', flex: 1, hide: true },
		{ field: 'Code', headerName: 'Code', width: 60 },
		{ field: 'Role', headerName: 'Role', flex: 1 },
		{
			field: 'fullName',
			headerName: 'Full name',
			flex: 1,
			valueGetter: getFullName,
		},
		{ field: 'State', headerName: 'State', flex: 1 },
		{ field: 'City', headerName: 'City', flex: 1 },
		{ field: 'Address', headerName: 'Address', flex: 1 },
		{ field: 'Email', headerName: 'Email', flex: 1 },
		{
			field: 'MobileNumber',
			headerName: 'Mobile number',
			flex: 1,
		},
		{
			field: 'BicycleCount',
			headerName: 'Bicycle count',
			flex: 1,
			align: 'center',
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
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<Typography component="h6" variant="h6">
				Client Info
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
						components={{
							Toolbar: GridToolbar,
						}}
						pageSize={1}
						rowsPerPageOptions={[1]}
					/>
				</div>
			</Container>
		</Box>
	);
}
