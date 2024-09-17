import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username'); 

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <nav>
            <header className="text-gray-400 bg-gray-900 body-font">
                <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                    <a className="flex title-font font-medium items-center text-white mb-4 md:mb-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                        <span className="ml-3 text-2xl font-semibold"> <span className='text-violet-500 font-bold'>&lt;</span> EmployeeOp <span className='text-violet-500 font-bold'>/&gt;</span></span>
                    </a>

                    {token ? (
                        <>
                        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-lg gap-20 justify-center">
                            <Link to="/admin-dashboard" className="mr-5 hover:text-white">Home</Link>
                            <Link to="/employee-list" className="mr-5 hover:text-white">Employee List</Link>
                            <span className="text-white">Welcome, {username}</span>
                        </nav>
                            <button onClick={handleLogout} className="inline-flex items-center font-bold bg-violet-800 border-0 py-1 px-3 focus:outline-none hover:bg-violet-700 rounded text-lg mt-4 md:mt-0">
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-wrap items-center text-lg justify-center">
                        </div>
                    )}
                </div>
            </header>
        </nav>
    );
};

export default Navbar;
