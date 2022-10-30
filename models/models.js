const sequelize = require('../config/db')
const {DataTypes} = require('sequelize')

const Users = sequelize.define('users', {
    name: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    verified: {type: DataTypes.BOOLEAN}
})

module.exports = {
   Users
}