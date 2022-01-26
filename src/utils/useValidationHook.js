import React from 'react';

const useValidationHook = () => {
	const isValidCode = (enteredCode) => {
		console.log(enteredCode);
		if (enteredCode >= 1000 && enteredCode <= 9999) {
			return true;
		} else {
			return false;
		}
	};

	const isValidColor = (enteredColor) => {
		if (enteredColor.length >= 3 && enteredColor.length <= 100) {
			return true;
		} else {
			return false;
		}
	};

	return {
		isValidCode,
		isValidColor,
	};
};

export default useValidationHook;
