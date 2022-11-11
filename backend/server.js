import path from 'path'
import express from 'express'
import cors from 'cors'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { OAuth2Client } from 'google-auth-library'

// Load config
//dotenv.config()
dotenv.config({ path: './.env' })
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_ID)

// Passport config
// require('./config/passport')(passport)

connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

const users = []

function upsert(array, item) {
  const i = array.findIndex((_item) => _item.email === item.email)
  if (i > -1) array[i] = item
  else array.push(item)
}

app.post('/api/google-login', async (req, res) => {
  const { token } = req.body
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  })

  const { name, email, picture } = ticket.getPayload()
  upsert(users, { name, email, picture })
  res.status(201)
  res.json({ name, email, picture })
})
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.use(notFound)
app.use(errorHandler)
// RENDER

app.use(
  cors({
    // origin: ['http://localhost:3000', 'https://pictusweb-mern.onrender.com'],
  })
)

const PORT = process.env.PORT || 5000
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
