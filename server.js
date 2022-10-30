require('dotenv').config()
const express = require('express')
const sequelize = require('./config/db.js')
const cors = require('cors')
const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())

// routes
const userRouter = require('./api/router/auth.js')
app.use(userRouter)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}


start()