const sequelize = require('../config/db')
const {DataTypes} = require('sequelize')

const UserVerification = sequelize.define('userVerifications', {
    userId: {type: DataTypes.INTEGER},
    uniqueString: {type: DataTypes.STRING},
    createdAt: {type: DataTypes.DATE},
    expiresdAt: {type: DataTypes.DATE}
})

module.exports = {
  UserVerification
}