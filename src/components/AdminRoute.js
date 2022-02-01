import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserData, isAuthenticated } from '../auth/Authentication';

const AdminRoute = ({ children }) => {
	let role = '';
	if (isAuthenticated()) {
		role = getUserData().Role;
	}
	return isAuthenticated() && role === 'APPADMIN' ? (
		children
	) : (
		<Navigate to="/restricted" />
	);
};

export default AdminRoute;
