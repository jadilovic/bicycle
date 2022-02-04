const useBicycleValidationHook = () => {
	//
	const codeError = (enteredCode) => {
		if (enteredCode >= 1000 && enteredCode <= 9999) {
			return false;
		} else {
			return {
				error: true,
				msg: 'Code must be minimum 1000 or maximum 9999',
			};
		}
	};

	const colorError = (enteredColor) => {
		if (enteredColor.length >= 3 && enteredColor.length <= 100) {
			return false;
		} else {
			return {
				error: true,
				msg: 'Color must be minimum 3 and maximum 100 characters long',
			};
		}
	};

	return {
		codeError,
		colorError,
	};
};

export default useBicycleValidationHook;
