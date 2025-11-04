const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize Sequelize with configuration from .env
const sequelize = new Sequelize({
    // DB_DIALECT=sqlite
    dialect: process.env.DB_DIALECT, 
    
    // DB_STORAGE=./crm_db.sqlite (This is where SQLite stores the file)
    storage: process.env.DB_STORAGE, 

    // Optional: disable logging Sequelize's SQL queries to keep the console clean
    logging: false, 
});

module.exports = sequelize;