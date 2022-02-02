const useUniqueValidationHook = () => {
	//
	const personCodeError = (enteredCode, persons) => {
		const person = persons.find(
			(person) => person.Code === Number(enteredCode)
		);
		if (person) {
			return {
				error: true,
				msg: 'Entered client code must be unique!',
			};
		} else {
			return false;
		}
	};

	const bicycleCodeError = (enteredCode, bicycles) => {
		const bicycle = bicycles.find(
			(bicycle) => bicycle.Code === Number(enteredCode)
		);
		if (bicycle) {
			return {
				error: true,
				msg: 'Entered bicycle code must be unique!',
			};
		} else {
			return false;
		}
	};

	const dockCodeError = (enteredCode, docks) => {
		const dock = docks.find((dock) => dock.Code === Number(enteredCode));
		if (dock) {
			return {
				error: true,
				msg: 'Entered dock code must be unique!',
			};
		} else {
			return false;
		}
	};

	return {
		personCodeError,
		bicycleCodeError,
		dockCodeError,
	};
};

export default useUniqueValidationHook;
