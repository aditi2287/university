// import React from 'react';
// import Register from './components/register';
// import Login from './components/login';
// import Applications from './components/applications';

// function App() {
//     return (
//         <div className="App">
//             <h1>University Insights</h1>
//             <Register />
//             <Login />
//             <Applications />
//         </div>
//     );
// }

// export default App;



// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import the necessary components
// import Register from './components/register';
// import Login from './components/login';
// import Applications from './components/applications';

// function App() {
//     return (
//         <Router> {/* Wrap your app with the Router */}
//             <Routes> {/* Use Routes to define your routes */}
//                 <Route path="/register" element={<Register />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/applications" element={<Applications />} />
//                 {/* Add other routes as needed */}
//             </Routes>
//         </Router>
//     );
// }

// export default App;



import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import the necessary components
import Register from './components/register';
import Login from './components/login';
import Applications from './components/applications';
import Home from './components/Home' // Import the home component

function App() {
    return (
        <Router> {/* Wrap your app with the Router */}
            <Routes> {/* Use Routes to define your routes */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/" element={<Home />} /> {/* Add other routes as needed */}
            </Routes>
        </Router>
    );
}

export default App;