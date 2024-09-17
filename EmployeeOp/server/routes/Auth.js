import express from 'express';
import User from '../models/User.js'; 

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
       
        const user = await User.findOne({ username });
        
       
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
  
        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
