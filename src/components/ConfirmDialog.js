import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmDialog(props) {
	const { selectedBicycle, confirmOpen, setConfirmOpen, deleteBicycle } = props;

	const handleClose = () => {
		setConfirmOpen(false);
	};

	const handleYes = () => {
		deleteBicycle(selectedBicycle);
		setConfirmOpen(false);
	};

	return (
		<div>
			<Dialog open={confirmOpen} onClose={handleClose}>
				<DialogTitle>{'Delete Bicycle?'}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{`Do you wish to delete selected bicycle with code ${selectedBicycle.Code} and color ${selectedBicycle.Color}?`}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button variant="contained" color="success" onClick={handleYes}>
						Yes
					</Button>
					<Button
						variant="contained"
						color="error"
						onClick={handleClose}
						autoFocus
					>
						No
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
