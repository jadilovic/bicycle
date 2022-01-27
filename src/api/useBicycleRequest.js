import React from 'react';
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
		console.log(newBicycle);
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
				console.log(res.data);
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
	};
};

export default useBicycleRequest;
