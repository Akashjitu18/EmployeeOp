import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import User from './models/User.js'; 
import EmployeeRoutes from './routes/EmployeeRoutes.js'; 
import multer from 'multer';

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'your_secret_key';


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

app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', EmployeeRoutes);


mongoose.connect('mongodb://localhost:27017/employee_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));


app.use('/uploads', express.static('uploads'));
app.use('/api', EmployeeRoutes); 

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && user.password === password) {
            const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
