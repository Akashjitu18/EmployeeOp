import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import ProtectedRoute from './components/ProtectedRoute';
import CreateEmployee from './components/CreateEmployee';
import EditEmployee from './components/EditEmployee';


function App() {
    return (
        <Router>
            <Navbar />
            <div className='h-[91.5vh] '>
                <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                    {/* <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[610px] w-[810px] rounded-full bg-fuchsia-400 opacity-25 blur-[100px]"> </div>    */}
                    <div className="absolute top-0 -z-1 h-screen w-screen rotate-180 transform bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]"></div>
                </div>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin-dashboard" element={<ProtectedRoute element={Dashboard} />} />
                    <Route path="/employee-list" element={<ProtectedRoute element={EmployeeList} />} />
                    <Route path="/create-employee" element={<ProtectedRoute element={CreateEmployee} />} />
                    <Route path="/edit-employee/:id" element={<ProtectedRoute element={EditEmployee} />} />

                </Routes>

            </div>
        </Router>
    );
}

export default App;



