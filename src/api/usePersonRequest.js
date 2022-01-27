import React from 'react';
const axios = require('axios').default;

const usePersonRequest = () => {
	const ASSIG_PATH = 'https://assignmentapi.timelinemaster.com/';
	const REAL_TOKEN = '2074';

	const getPersons = async () => {
		try {
			return axios({
				method: 'POST',
				url: `${ASSIG_PATH}api/v1001/Application/Person/List`,
				data: {
					Token: REAL_TOKEN,
					Request: null,
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

	const createPerson = async (personData) => {
		return axios({
			method: 'POST',
			url: `${ASSIG_PATH}api/v1001/Application/Person/Create`,
			data: {
				Token: REAL_TOKEN,
				Request: personData,
			},
			headers: {
				authorization: `Bearer ${REAL_TOKEN}`,
			},
		})
			.then((res) => {
				console.log(res.data);
				return res.data.Response;
			})
			.catch((err) => {
				console.log(err.response);
				console.log(err.response.data);
				console.log(err.response.data.msg);
				return err;
			});
	};

	return {
		getPersons,
		createPerson,
	};
};

export default usePersonRequest;