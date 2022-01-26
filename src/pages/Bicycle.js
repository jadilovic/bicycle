import React, { useEffect, useState } from 'react';
import useBicycleRequest from '../api/useBicycleRequest';
import { DataGrid } from '@mui/x-data-grid';
import LoadingPage from '../components/LoadingPage';

const columns = [
	{ field: 'id', headerName: 'ID', type: 'number' },
	{ field: 'Code', headerName: 'Code', type: 'number' },
	{ field: 'Color', headerName: 'Color' },
	{ field: 'Status', headerName: 'Status' },
	{
		field: 'Client',
		headerName: 'Client',
		type: 'number',
	},
	{
		field: 'Dock',
		headerName: 'Dock',
		type: 'number',
	},
];

export default function Bicycle() {
	const [loading, setLoading] = useState(true);
	const [rows, setRows] = useState([]);
	const bicycleAPI = useBicycleRequest();

	const displayBicycles = async () => {
		const bicycles = await bicycleAPI.getBicycles();
		bicycles.forEach(function (element, index) {
			element.id = index + 1;
		});
		console.log(bicycles);
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
		<div style={{ height: 400, width: '100%' }}>
			<DataGrid
				rows={rows}
				columns={columns}
				pageSize={5}
				rowsPerPageOptions={[5]}
				checkboxSelection
			/>
		</div>
	);
}
