const express = require('express');
const dotenv = require('dotenv');
// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Load routes 
const employeeRoutes = require('./routes/employeeRoutes');
app.use('/api/employees', employeeRoutes);
const enquiryRoutes = require('./routes/enquiryRoutes');
app.use('/api/enquiries', enquiryRoutes);


// Simple root route
app.get('/', (req, res) => {
    res.send('CRM API is running.');
});

// Database initialization (assuming models/index.js handles connection)
// const db = require('./models');
// db.sequelize.sync().then(() => {
//     app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
// });




const db = require('./models');


// This chain must execute and resolve for the server to start
db.sequelize.sync({ force: false }).then(() => {
    // This line starts the HTTP server and keeps the Node process running
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}).catch(err => {
    // If the database fails to connect/sync, the app will exit clean
    console.error('Failed to sync database:', err); 
    // The process exits here, causing the "clean exit" message
    // If you see this error in your log, you need to fix the database connection/config.
});
