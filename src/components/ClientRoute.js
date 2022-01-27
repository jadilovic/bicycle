import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from '../auth/Authentication';

const ClientRoute = ({ component: Component, ...rest }) => {
	return (
		// Show the component only when the user is logged in
		// Otherwise, redirect the user to Login page
		<Route
			{...rest}
			render={(props) =>
				isAuthenticated() ? <Component {...props} /> : <Navigate to="/" />
			}
		/>
	);
};

export default ClientRoute;
