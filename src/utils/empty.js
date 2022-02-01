// ONLY USED IN DEVELOPMENT
// const emptyDock = async (dock) => {
// 	if (dock.Code === 4444) {
// 		dock.BicycleCount = 0;
// 		dock.BicycleDockNumber = 2;
// 	} else {
// 		dock.BicycleCount = 0;
// 	}
// 	const modifiedDock = await dockAPI.modifyDock(dock);
// 	console.log(modifiedDock);
// };

// const emptyDocks = async () => {
// 	const dockList = await dockAPI.getDocks();
// 	for (let index = 0; index < dockList.length; index++) {
// 		await emptyDock(dockList[index]);
// 	}
// };

// const emptyClient = async (client) => {
// 	if (client.Code === 6689) {
// 		client.BicycleCount = 50;
// 	} else {
// 		client.BicycleCount = 0;
// 	}
// 	const modifiedClient = await personAPI.modifyPerson(client);
// 	console.log(modifiedClient);
// };

// const emptyClients = async () => {
// 	const clientList = await personAPI.getPersons();
// 	for (let index = 0; index < clientList.length; index++) {
// 		await emptyClient(clientList[index]);
// 	}
// };
// ONLY USED IN DEVELOPMENT
