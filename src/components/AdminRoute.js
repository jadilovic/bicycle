import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { getUserData, isAuthenticated } from '../auth/Authentication';

const TeacherRoute = ({ component: Component, ...rest }) => {
	let role = '';
	if (isAuthenticated()) {
		role = getUserData().role;
	}
	return (
		// Show the component only when the user is logged in
		// Otherwise, redirect the user to Login page
		<Route
			{...rest}
			render={(props) =>
				isAuthenticated() && role === 'APPADMIN' ? (
					<Component {...props} />
				) : (
					<Navigate to="/restricted" />
				)
			}
		/>
	);
};

export default TeacherRoute;
