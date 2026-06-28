require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const ConnectDB = require('./MongoConnect/db')
const authRoutes = require('./Routes/auth')
const cookieParser = require('cookie-parser')

const PORT = process.env.PORT

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json())
app.use(cookieParser());
app.use('/', authRoutes)
// console.log(ipconfig.address())

ConnectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server was running on http://localhost:${PORT}`);
        })
    })
