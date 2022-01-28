export const login = (user) => {
	localStorage.setItem('user', JSON.stringify(user));
};

export const logout = () => {
	localStorage.removeItem('user');
};

export const getUserData = () => {
	const jsonUserData = localStorage.getItem('user');
	return JSON.parse(jsonUserData);
};

export const isAuthenticated = () => {
	if (localStorage.getItem('user')) {
		return true;
	}
	return false;
};
