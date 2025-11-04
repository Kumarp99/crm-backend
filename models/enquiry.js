// models/Enquiry.js


const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Enquiry = sequelize.define('Enquiry', {
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
            allowNull: false
        },
        courseInterest: {
            type: DataTypes.STRING
        },
        claimed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false, // Default is false (unclaimed)
            allowNull: false
        }
        // counselorId is added automatically by the association setup
    });

    // We will set up the association (relationship) in models/index.js
    return Enquiry;
    
};