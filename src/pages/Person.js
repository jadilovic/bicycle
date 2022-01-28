import React, { useEffect, useState } from 'react';
import UserWindow from '../utils/UserWindow';
import usePersonRequest from '../api/usePersonRequest';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import LoadingPage from '../components/LoadingPage';
import { Container, Box, Button, Typography } from '@mui/material';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

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

export default function Person() {
	const screen = UserWindow();

	const userScreenHeight = window.innerHeight;
	const [loading, setLoading] = useState(true);
	const [rows, setRows] = useState([]);
	const personAPI = usePersonRequest();

	const displayPersons = async () => {
		const persons = await personAPI.getPersons();
		persons.forEach(function (element, index) {
			element.id = index + 1;
		});
		setRows(persons);
		setLoading(false);
	};

	useEffect(() => {
		displayPersons();
	}, []);

	console.log(rows);

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
				Clients list
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
						components={{
							Toolbar: GridToolbar,
						}}
						// pageSize={5}
						// rowsPerPageOptions={[5]}
					/>
				</div>
			</Container>
		</Box>
	);
}
