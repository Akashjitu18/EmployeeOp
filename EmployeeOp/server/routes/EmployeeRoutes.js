import express from 'express';
import multer from 'multer';
import Employee from '../models/Employee.js';


const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Only JPG, PNG and JPEG files are allowed'), false);
        }
    }
});

router.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/employees', upload.single('f_Image'), async (req, res) => {
    const { f_Id, f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course } = req.body;
    const f_Image = req.file ? req.file.path : null;

    try {
        const newEmployee = new Employee({
            f_Id,
            f_Image,
            f_Name,
            f_Email,
            f_Mobile,
            f_Designation,
            f_gender,
            f_Course,
        });

        await newEmployee.save();
        res.json({ message: 'Employee added successfully' });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.f_Email) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});



router.delete('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (employee) {
            res.json({ message: 'Employee deleted successfully' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});



//edit
router.get('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/employees/:id', upload.single('f_Image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course } = req.body;
        const f_Image = req.file ? req.file.path : undefined;
        const updatedData = {
            f_Name,
            f_Email,
            f_Mobile,
            f_Designation,
            f_gender,
            f_Course,
        };

        if (f_Image) {
            updatedData.f_Image = f_Image;
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedData, { new: true });
        if (updatedEmployee) {
            res.json({ message: 'Employee updated successfully', employee: updatedEmployee });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.f_Email) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/employees/search', async (req, res) => {
    const { query } = req.query;
    try {
        const employees = await Employee.find({
            $or: [
                { f_Name: { $regex: query, $options: 'i' } },
                { f_Email: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
