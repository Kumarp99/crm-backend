const { Sequelize } = require('sequelize');
const path = require('path');

// 1. Initialize Sequelize (e.g., SQLite connection)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'crm_backend.sqlite') 
});

// 2. 💡 VITAL FIX: Declare the 'db' object here!
const db = {}; // <--- ADD OR MOVE THIS LINE HERE

// 3. Attach Sequelize instances to the db object
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 4. Load Models (where your error occurred, which is now fixed)
db.Employee = require('./Employee')(sequelize); 
db.Enquiry = require('./Enquiry')(sequelize);


// Define Associations (The Relationship)
// One Employee HAS MANY Enquiries
db.Employee.hasMany(db.Enquiry, {
    foreignKey: 'counselorId', // This creates the 'counselorId' column in the Enquiry table
    as: 'enquiries'
});

// An Enquiry BELONGS TO one Employee
db.Enquiry.belongsTo(db.Employee, {
    foreignKey: 'counselorId',
    as: 'counselor'
});


// Export the database object
module.exports = db;