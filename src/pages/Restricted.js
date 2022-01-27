import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
// components
import restricted from '../images/restricted.jpg';
import UserWindow from '../utils/UserWindow';

export default function Restricted() {
	const screen = UserWindow();
	console.log('restricted');
	return (
		<Container>
			<Box
				sx={{
					paddingLeft: screen.dynamicWidth < 600 ? 0 : 22,
					maxWidth: 700,
					margin: 'auto',
					textAlign: 'center',
				}}
			>
				<Typography variant="h5" paragraph>
					Sorry, this is restricted page!
				</Typography>
				<Typography sx={{ color: 'text.secondary' }}>
					Return to your previous page or go to Home page by clicking the button
					below.
				</Typography>

				<Box
					component="img"
					src={restricted}
					sx={{
						height: '100%',
						width: '100%',
						mx: 'auto',
						my: { xs: 5, sm: 5 },
					}}
				/>

				<Button
					to="/materials"
					size="large"
					variant="contained"
					component={RouterLink}
				>
					Go start page
				</Button>
			</Box>
		</Container>
	);
}