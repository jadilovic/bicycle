import React, { useEffect, useState } from 'react';
import UserWindow from '../utils/UserWindow';
import usePersonRequest from '../api/usePersonRequest';
import { DataGrid } from '@mui/x-data-grid';
import LoadingPage from '../components/LoadingPage';
import { Container, Box, Button } from '@mui/material';

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
				paddingTop: 10,
				paddingLeft: screen.dynamicWidth < 600 ? 0 : 25,
			}}
		>
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
