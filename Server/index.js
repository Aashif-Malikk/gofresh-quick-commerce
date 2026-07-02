require('dotenv').config()
const express      = require('express')
const cors         = require('cors')
const cookieParser = require('cookie-parser')
const ConnectDB    = require('./MongoConnect/db')
const authRoutes   = require('./Routes/auth')

const app = express()

app.set('trust proxy', 1)

app.use(cors({
    origin: [
        'https://gofresh-market.netlify.app',
        'http://localhost:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/', authRoutes)

const PORT = process.env.PORT || 3000   

ConnectDB()
    .then(() => {
        console.log('✅ MongoDB connected')
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.error('❌ MongoDB connection failed:', err.message)
        process.exit(1) 
    })