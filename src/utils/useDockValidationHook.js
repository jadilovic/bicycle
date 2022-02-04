const useDockValidationHook = () => {
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

	const stateError = (enteredState) => {
		if (enteredState.length >= 3 && enteredState.length <= 200) {
			return false;
		} else {
			return {
				error: true,
				msg: 'State must be minimum 3 and maximum 200 characters long',
			};
		}
	};

	const cityError = (enteredCity) => {
		if (enteredCity.length >= 3 && enteredCity.length <= 200) {
			return false;
		} else {
			return {
				error: true,
				msg: 'City must be minimum 3 and maximum 200 characters long',
			};
		}
	};

	const addressError = (enteredAddress) => {
		if (enteredAddress.length >= 3 && enteredAddress.length <= 200) {
			return false;
		} else {
			return {
				error: true,
				msg: 'Address must be minimum 3 and maximum 200 characters long',
			};
		}
	};

	const bicycleDockNumberError = (enteredBicycleDockNumber) => {
		if (enteredBicycleDockNumber >= 1 && enteredBicycleDockNumber <= 50) {
			return false;
		} else {
			return {
				error: true,
				msg: 'Bicycle dock number (number of spaces for bicycles on a dock) must be minimum 1 or maximum 50',
			};
		}
	};

	return {
		codeError,
		stateError,
		cityError,
		addressError,
		bicycleDockNumberError,
	};
};

export default useDockValidationHook;
