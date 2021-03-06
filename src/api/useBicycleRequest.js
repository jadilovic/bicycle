const axios = require('axios').default;

const useBicycleRequest = () => {
	const ASSIG_PATH = 'https://assignmentapi.timelinemaster.com/';
	const REAL_TOKEN = '2074';

	const getBicycles = async () => {
		try {
			return axios({
				method: 'POST',
				url: `${ASSIG_PATH}api/v1001/Application/Bicycle/List`,
				data: {
					Token: REAL_TOKEN,
					Request: null,
				},
				headers: {
					authorization: `Bearer ${REAL_TOKEN}`,
				},
			}).then((res) => {
				if (res.data.Response) {
					return res.data.Response;
				} else {
					return [];
				}
			});
		} catch (err) {
			console.log(err.response);
			return err.response.data.msg;
		}
	};

	const getBicycleStatuses = async () => {
		try {
			return axios({
				method: 'POST',
				url: `${ASSIG_PATH}api/v1001/Application/BicycleStatus/List`,
				data: {
					Token: REAL_TOKEN,
					Request: null,
				},
				headers: {
					authorization: `Bearer ${REAL_TOKEN}`,
				},
			}).then((res) => {
				if (res.data.Response) {
					return res.data.Response;
				} else {
					return [];
				}
			});
		} catch (err) {
			console.log(err.response);
			return err.response.data.msg;
		}
	};

	const createBicycle = async (newBicycle) => {
		try {
			return axios({
				method: 'POST',
				url: `${ASSIG_PATH}api/v1001/Application/Bicycle/Create`,
				data: {
					Token: REAL_TOKEN,
					Request: newBicycle,
				},
				headers: {
					authorization: `Bearer ${REAL_TOKEN}`,
				},
			}).then((res) => {
				return res.data.Response;
			});
		} catch (err) {
			console.log(err.response);
			return err.response.data.msg;
		}
	};

	const modifyBicycle = async (modifiedBicycle) => {
		try {
			return axios({
				method: 'POST',
				url: `${ASSIG_PATH}api/v1001/Application/Bicycle/Modify`,
				data: {
					Token: REAL_TOKEN,
					Request: modifiedBicycle,
				},
				headers: {
					authorization: `Bearer ${REAL_TOKEN}`,
				},
			}).then((res) => {
				return res.data.Response;
			});
		} catch (err) {
			console.log(err.response);
			return err.response.data.msg;
		}
	};

	const deleteBicycle = async (bicycleCode) => {
		try {
			return axios({
				method: 'POST',
				url: `${ASSIG_PATH}api/v1001/Application/Bicycle/Remove`,
				data: {
					Token: REAL_TOKEN,
					Request: {
						Code: bicycleCode,
					},
				},
				headers: {
					authorization: `Bearer ${REAL_TOKEN}`,
				},
			}).then((res) => {
				return res.data.Response;
			});
		} catch (err) {
			console.log(err.response);
			return err.response.data.msg;
		}
	};

	return {
		getBicycles,
		getBicycleStatuses,
		createBicycle,
		modifyBicycle,
		deleteBicycle,
	};
};

export default useBicycleRequest;
