import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { getUserData, isAuthenticated } from '../auth/Authentication';

const TeacherRoute = ({ children }) => {
	let role = '';
	if (isAuthenticated()) {
		role = getUserData().role;
	}
	return isAuthenticated() && role === 'APPADMIN' ? (
		children
	) : (
		<Navigate to="/restricted" />
	);
};

export default TeacherRoute;
