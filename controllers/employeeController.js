// employeeController.js snippet - inside the login function
const jwt = require('jsonwebtoken');

// ... successful password check logic ...
const employeeId = employee.id;

const token = jwt.sign(
    { id: employeeId },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // Token expires after 1 hour
);

return res.status(200).json({
    message: 'Login successful',
    token: token
});
