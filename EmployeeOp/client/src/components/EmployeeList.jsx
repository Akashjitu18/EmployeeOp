import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(6);

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        setFilteredEmployees(
            employees.filter(emp =>
                emp.f_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.f_Email.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, employees]);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/employees');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };


    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };



    const handleDelete = async (id,name) => {
        const c = confirm(`Confirm the delete of employee ${name}`)
        if(c){
        try {
            const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setEmployees(employees.filter(emp => emp._id !== id));
            } else {
                console.error('Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    }
    };



    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Employee List</h1>
                <span className='font-bold text-lg '>Total Employees Count : {employees.length}</span>
                <Link
                    to="/create-employee"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Create Employee
                </Link>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search"
                    className="w-full px-4 py-2 border rounded-md"
                />
            </div>

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4 border-b text-left">Unique Id</th>
                        <th className="py-2 px-4 border-b text-left">Image</th>
                        <th className="py-2 px-4 border-b text-left">Name</th>
                        <th className="py-2 px-4 border-b text-left">Email</th>
                        <th className="py-2 px-4 border-b text-left">Mobile No</th>
                        <th className="py-2 px-4 border-b text-left">Designation</th>
                        <th className="py-2 px-4 border-b text-left">Gender</th>
                        <th className="py-2 px-4 border-b text-left">Course</th>
                        <th className="py-2 px-4 border-b text-left">Create Date</th>
                        <th className="py-2 px-4 border-b text-left">Action</th>
                    </tr>
                </thead>
                {currentEmployees.length === 0 && (
                    <tbody>
                        <tr>
                            <td className="py-4 px-4 border-b text-center" colSpan="10">
                                No employees
                            </td>
                        </tr>
                    </tbody>
                )}

                {currentEmployees.length > 0 && <tbody>
                    {currentEmployees.map(emp => (
                        <tr key={emp._id}>
                            <td className="py-2 px-4 border-b">{emp.f_Id.slice(0, 8)}</td>
                            <td className="py-2 px-4 border-b"><img src={`http://localhost:3000/${emp.f_Image}`} alt={emp.f_Name} className="w-16  h-16 object-cover rounded-full" /></td>
                            <td className="py-2 px-4 border-b">{emp.f_Name}</td>
                            <td className="py-2 px-4 border-b">{emp.f_Email}</td>
                            <td className="py-2 px-4 border-b">{emp.f_Mobile}</td>
                            <td className="py-2 px-4 border-b">{emp.f_Designation}</td>
                            <td className="py-2 px-4 border-b">{emp.f_gender}</td>
                            <td className="py-2 px-4 border-b">{emp.f_Course.join(', ')}</td>
                            <td className="py-2 px-4 border-b">{new Date(emp.f_Createdate).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    onClick={() => handleDelete(emp._id,emp.f_Name)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                                <Link
                                    to={`/edit-employee/${emp._id}`}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 ml-2"
                                >
                                    Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>}
            </table>


            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                    Previous
                </button>
                <span className="text-gray-700">
                    Page {currentPage} of {Math.ceil(filteredEmployees.length / employeesPerPage)}
                </span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredEmployees.length / employeesPerPage)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default EmployeeList;
