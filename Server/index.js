require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const ConnectDB = require('./MongoConnect/db')
const authRoutes = require('./Routes/auth')
const cookieParser = require('cookie-parser')

const PORT = process.env.PORT
app.set('trust proxy', 1)
app.use(cors({
    origin: [
        'https://gofresh-market.netlify.app',
        'http://localhost:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors()) // Enable pre-flight for all routes

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
