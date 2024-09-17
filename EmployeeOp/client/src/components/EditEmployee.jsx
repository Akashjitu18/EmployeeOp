import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const EditEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [formData, setFormData] = useState({
        f_Id: '',
        f_Name: '',
        f_Email: '',
        f_Mobile: '',
        f_Designation: '',
        f_gender: '',
        f_Course: [],
        f_Image: null,
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/employees/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setEmployee(data);
                setFormData({
                    f_Id: data.f_Id,
                    f_Name: data.f_Name,
                    f_Email: data.f_Email,
                    f_Mobile: data.f_Mobile,
                    f_Designation: data.f_Designation,
                    f_gender: data.f_gender,
                    f_Course: data.f_Course,
                    f_Image: null,
                });
            } catch (error) {
                console.error('Error fetching employee:', error);
            }
        };

        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'checkbox') {
            setFormData(prevData => ({
                ...prevData,
                f_Course: checked
                    ? [...prevData.f_Course, value]
                    : prevData.f_Course.filter(course => course !== value),
            }));
        } else if (type === 'file') {
            const file = files[0];
            if (file) {
                if (!['image/jpeg', 'image/png'].includes(file.type)) {
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        f_Image: 'Only JPG, PNG and JPEG files are allowed',
                    }));
                    return;
                }

                if (file.size > 5 * 1024 * 1024) {
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        f_Image: 'File size must be less than 5MB',
                    }));
                    return;
                }
                setFormData(prevData => ({
                    ...prevData,
                    f_Image: file,
                }));
                setErrors(prevErrors => ({
                    ...prevErrors,
                    f_Image: null,
                }));
            }
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^[0-9]{10}$/;

        if (!formData.f_Name) errors.f_Name = 'Name is required';
        if (!formData.f_Email) {
            errors.f_Email = 'Email is required';
        } else if (!emailRegex.test(formData.f_Email)) {
            errors.f_Email = 'Invalid email format';
        }
        if (!formData.f_Mobile) {
            errors.f_Mobile = 'Mobile number is required';
        } else if (!mobileRegex.test(formData.f_Mobile)) {
            errors.f_Mobile = 'Mobile number must be 10 digits';
        }
        if (!formData.f_Designation) errors.f_Designation = 'Designation is required';
        if (!formData.f_gender) errors.f_gender = 'Gender is required';
        if (formData.f_Course.length === 0) errors.f_Course = 'At least one course must be selected';
        if (!formData.f_Image && !employee?.f_Image) errors.f_Image = 'Image upload is required';

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataToSend = new FormData();
        // for (const key in formData) {
        //     formDataToSend.append(key, formData[key]);
        // }
        for (const key in formData) {
            if (key === 'f_Image' && formData[key]) {
                formDataToSend.append(key, formData[key]);
            } else if (key !== 'f_Image') {
                formDataToSend.append(key, formData[key]);
            }
        }
        

        try {
            const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
                method: 'PUT',
                body: formDataToSend
            });
            if (response.ok) {
                setSuccessMessage('Employee updated successfully!');
                setFormData({
                    f_Name: '',
                    f_Email: '',
                    f_Mobile: '',
                    f_Designation: '',
                    f_gender: '',
                    f_Course: [],
                    f_Image: null,
                });
                setErrors({});
                alert("Succesfully edited employee deatails")
                navigate('/employee-list');
            } else {
                const data = await response.json();
                setErrors({ server: data.message });
            }
        } catch (error) {
            console.error('Error updating employee:', error);
            setErrors({ server: 'Server error' });
        }
    };

    if (!employee) return <p>Loading...</p>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Edit Employee</h1>
                <Link
                    to="/employee-list"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    BACK
                </Link>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                {errors.server && <div className="text-red-500">{errors.server}</div>}
                <div>
                    <label className="block mb-1">Name:</label>
                    <input
                        type="text"
                        name="f_Name"
                        value={formData.f_Name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                    {errors.f_Name && <div className="text-red-500">{errors.f_Name}</div>}
                </div>

                <div>
                    <label className="block mb-1">Email:</label>
                    <input
                        type="email"
                        name="f_Email"
                        value={formData.f_Email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                    {errors.f_Email && <div className="text-red-500">{errors.f_Email}</div>}
                </div>

                <div>
                    <label className="block mb-1">Mobile No:</label>
                    <input
                        type="text"
                        name="f_Mobile"
                        value={formData.f_Mobile}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                    {errors.f_Mobile && <div className="text-red-500">{errors.f_Mobile}</div>}
                </div>

                <div>
                    <label className="block mb-1">Designation:</label>
                    <select
                        name="f_Designation"
                        value={formData.f_Designation}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                    >
                        <option value="">Select</option>
                        <option value="HR">HR</option>
                        <option value="Manager">Manager</option>
                        <option value="Sales">Sales</option>
                    </select>
                    {errors.f_Designation && <div className="text-red-500">{errors.f_Designation}</div>}
                </div>

                <div>
                    <label className="block mb-1">Gender:</label>
                    <div className="flex gap-4">
                        <label>
                            <input
                                type="radio"
                                name="f_gender"
                                value="Male"
                                checked={formData.f_gender === 'Male'}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Male
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="f_gender"
                                value="Female"
                                checked={formData.f_gender === 'Female'}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Female
                        </label>
                    </div>
                    {errors.f_gender && <div className="text-red-500">{errors.f_gender}</div>}
                </div>

                <div>
                    <label className="block mb-1">Course:</label>
                    <div className="flex gap-4">
                        <label>
                            <input
                                type="checkbox"
                                name="f_Course"
                                value="MCA"
                                checked={formData.f_Course.includes('MCA')}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            MCA
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="f_Course"
                                value="BCA"
                                checked={formData.f_Course.includes('BCA')}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            BCA
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="f_Course"
                                value="BSC"
                                checked={formData.f_Course.includes('BSC')}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            BSC
                        </label>
                    </div>
                    {errors.f_Course && <div className="text-red-500">{errors.f_Course}</div>}
                </div>

                <div>
                    <label className="block mb-1">Image:</label>
                    <input
                        type="file"
                        name="f_Image"
                        onChange={handleChange}
                         accept=".jpg,.png,.jpeg"
                        className="w-full px-3 py-2 border rounded"
                    />
                    {errors.f_Image && <div className="text-red-500">{errors.f_Image}</div>}
                </div>

                <div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Update Employee
                    </button>
                </div>

                {successMessage && <div className="text-green-500">{successMessage}</div>}
            </form>
        </div>
    );
};

export default EditEmployee;
