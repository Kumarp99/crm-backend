// models/Employee.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Employee = sequelize.define('Employee', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true, // Ensures no two counselors share an email
            allowNull: false
        },
        password: {
            type: DataTypes.STRING, // Will store the hashed password
            allowNull: false
        }
    });

    // We will set up the association (relationship) in models/index.js
    return Employee;
};