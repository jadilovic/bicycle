import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

//Import the pages

import Bicycle from './pages/Bicycle';
import Dock from './pages/Dock';
import Login from './pages/Login';
import Person from './pages/Person';

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route exact path="/" element={<Login />} />
					<Route exact path="bicycle" element={<Bicycle />} />
					<Route exact path="dock" element={<Dock />} />
					<Route exact path="person" element={<Person />} />
				</Routes>
				<div className="list">
					<ul>
						<li>
							<Link to="/">Login</Link>
						</li>
						<li>
							<Link to="dock">Dock</Link>
						</li>
						<li>
							<Link to="bicycle">Bicycle</Link>
						</li>
						<li>
							<Link to="person">Person</Link>
						</li>
					</ul>
				</div>
			</Router>
		</div>
	);
}

export default App;
