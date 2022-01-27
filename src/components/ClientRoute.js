import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../auth/Authentication';

const ClientRoute = ({ children }) => {
	return isAuthenticated() ? children : <Navigate to="/" />;
};

export default ClientRoute;
