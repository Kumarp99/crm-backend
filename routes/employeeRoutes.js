// routes/employeeRoutes.js

const express = require('express');
const router = express.Router();

// CRITICAL: Ensure these modules were installed via npm install
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// CRITICAL: Ensure this path is correct and the models object is complete
const db = require('../models'); 
const Employee = db.Employee; 

// --- 1. Register API (POST /api/employees/register) ---
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields.' });
    }

    try {
        // 1. Check if employee already exists
        let employee = await Employee.findOne({ where: { email } });
        if (employee) {
            return res.status(400).json({ message: 'Employee with this email already exists.' });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create the new Employee
        employee = await Employee.create({ name, email, password: hashedPassword });

        // 4. Generate JWT token
        // CRITICAL CHECK: Does JWT_SECRET exist in your .env file?
        const token = jwt.sign({ id: employee.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ 
            message: 'Employee registered successfully.',
            token,
            employee: { id: employee.id, name: employee.name, email: employee.email }
        });
    } catch (error) {
        console.error('Registration API Error:', error);
        // If the error is not a known application error, it's a 500
        res.status(500).json({ message: 'Server error during registration. Check console for details.' });
    }
});

// --- 2. Login API (POST /api/employees/login) ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the employee by email
        const employee = await Employee.findOne({ where: { email } });
        if (!employee) {
            return res.status(400).json({ message: 'Invalid Credentials.' });
        }

        // 2. Compare the received password with the stored hash
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials.' });
        }

        // routes/employeeRoutes.js snippet (Login API)

// ...
       // 3. Generate a JWT token
        // THIS LINE MUST NOW USE THE CORRECT ENVIRONMENT VARIABLE
       const token = jwt.sign({ id: employee.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful.', token });
        // END DIAGNOSIS CODE

        
       
        
        res.json({ 
            message: 'Login successful',
            token,
            employee: { id: employee.id, name: employee.name, email: employee.email }
        });
    } catch (error) {
        console.error('Login API Error:', error);
        res.status(500).json({ message: 'Server error during login. Check console for details.' });
    }
});

module.exports = router;