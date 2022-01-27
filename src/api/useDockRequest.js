import React from 'react';
const axios = require('axios').default;

const useDockRequest = () => {
	const ASSIG_PATH = 'https://assignmentapi.timelinemaster.com/';
	const REAL_TOKEN = '2074';

	const getDocks = async () => {
		try {
			return axios({
				method: 'POST',
				url: `${ASSIG_PATH}api/v1001/Application/Dock/List`,
				data: {
					Token: REAL_TOKEN,
					Request: null,
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
		getDocks,
	};
};

export default useDockRequest;