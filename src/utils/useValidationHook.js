import React from 'react';

const useValidationHook = () => {
	const codeError = (enteredCode) => {
		console.log(enteredCode);
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

	const nameError = (enteredName) => {
		if (enteredName.length >= 1 && enteredName.length <= 100) {
			return false;
		} else {
			return {
				error: true,
				msg: 'Name must be minimum 1 and maximum 100 characters long',
			};
		}
	};

	const surnameError = (enteredSurname) => {
		if (enteredSurname.length >= 1 && enteredSurname.length <= 100) {
			return false;
		} else {
			return {
				error: true,
				msg: 'Surname must be minimum 1 and maximum 100 characters long',
			};
		}
	};

	const stateError = (enteredState, dock) => {
		if (enteredState === '' && !dock) {
			return false;
		}
		if (enteredState.length >= 3 && enteredState.length <= 200) {
			return false;
		} else {
			return {
				error: true,
				msg: 'State must be minimum 3 and maximum 200 characters long',
			};
		}
	};

	const cityError = (enteredCity, dock) => {
		if (enteredCity === '' && !dock) {
			return false;
		}
		if (enteredCity.length >= 3 && enteredCity.length <= 200) {
			return false;
		} else {
			return {
				error: true,
				msg: 'City must be minimum 3 and maximum 200 characters long',
			};
		}
	};

	const addressError = (enteredAddress, dock) => {
		if (enteredAddress === '' && !dock) {
			return false;
		}
		if (enteredAddress.length >= 3 && enteredAddress.length <= 200) {
			return false;
		} else {
			return {
				error: true,
				msg: 'Address must be minimum 3 and maximum 200 characters long',
			};
		}
	};

	const emailError = (enteredEmail) => {
		if (
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(enteredEmail) &&
			enteredEmail.length >= 10 &&
			enteredEmail.length <= 200
		) {
			return false;
		} else {
			return {
				error: true,
				msg: 'Email must be minimum 10 and maximum 200 characters long and include @ and other email elements',
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

	const bicycleCountError = (enteredBicycleCount) => {
		if (enteredBicycleCount >= 0 && enteredBicycleCount <= 50) {
			return false;
		} else {
			return {
				error: true,
				msg: 'Bicycle count must be minimum 0 or maximum 50',
			};
		}
	};

	const dockCountError = (enteredBicycleDockNumber, enteredBicycleCount) => {
		if (Number(enteredBicycleDockNumber) >= Number(enteredBicycleCount)) {
			return false;
		} else {
			return {
				error: true,
				msg: 'Bicycle count can have maximum value of Bicycle Dock Number',
			};
		}
	};

	const mobileNumberError = (enteredMobileNumber) => {
		if (enteredMobileNumber.length >= 10 && enteredMobileNumber.length <= 30) {
			return false;
		} else {
			return {
				error: true,
				msg: 'Mobile number must be minimum 10 and maximum 30 characters long',
			};
		}
	};

	return {
		codeError,
		colorError,
		nameError,
		stateError,
		surnameError,
		cityError,
		addressError,
		emailError,
		mobileNumberError,
		bicycleCountError,
		bicycleDockNumberError,
		dockCountError,
	};
};

export default useValidationHook;
