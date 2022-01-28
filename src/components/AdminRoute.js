import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserData, isAuthenticated } from '../auth/Authentication';

const TeacherRoute = ({ children }) => {
	let role = '';
	if (isAuthenticated()) {
		role = getUserData().Role;
	}
	console.log('admin : ', role);
	return isAuthenticated() && role === 'APPADMIN' ? (
		children
	) : (
		<Navigate to="/restricted" />
	);
};

export default TeacherRoute;
