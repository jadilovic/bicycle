// ////////////////// USED FOR DEVELOPMENT
// const modifyPersonDockBicycle = async () => {
// 	const persons = await personAPI.getPersons();
// 	const person = persons.find((person) => person.Code === 1025);
// 	person.BicycleCount = 0;
// 	const modifiedPerson = await personAPI.modifyPerson(person);
// 	console.log('modified person 1025 : ', modifiedPerson);

// 	const bicycles = await bicycleAPI.getBicycles();
// 	const bicycle = bicycles.find((bicycle) => bicycle.Code === 8351);
// 	bicycle.Client = null;
// 	bicycle.Dock = 1111;
// 	const modifiedBicycle = await bicycleAPI.modifyBicycle(bicycle);
// 	console.log('modified bicycle 8351 : ', modifiedBicycle);

// 	const bicycles2 = await bicycleAPI.getBicycles();
// 	const bicycle2 = bicycles2.find((bicycle) => bicycle.Code === 3421);
// 	bicycle2.Client = null;
// 	bicycle2.Dock = 1111;
// 	const modifiedBicycle2 = await bicycleAPI.modifyBicycle(bicycle2);
// 	console.log('modified bicycle 3421 : ', modifiedBicycle2);

// 	const dockList = await dockAPI.getDocks();
// 	const selectedDock = dockList.find((dock) => dock.Code === 1111);
// 	selectedDock.BicycleCount = selectedDock.BicycleCount + 2;
// 	const modifiedDock = await dockAPI.modifyDock(selectedDock);
// 	console.log('modified dock 1111 : ', modifiedDock);
// };

// ////////////////////
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
