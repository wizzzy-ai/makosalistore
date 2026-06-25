import path from 'path'
import express from 'express'
import morgan from 'morgan'
import crypto from 'crypto'

import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import productRoutes from './routes/productRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

const requestIdMiddleware = (req, res, next) => {
  const requestId = req.header('x-request-id') || crypto.randomUUID()
  req.requestId = requestId
  res.setHeader('X-Request-Id', requestId)
  next()
}

const createApp = () => {
  const app = express()

  app.use(requestIdMiddleware)

  const isDev = process.env.NODE_ENV === 'development'
  const isTest = process.env.NODE_ENV === 'test'
  if (isDev || isTest) {
    morgan.token('request-id', (req) => req.requestId || '-')
    app.use(
      morgan(':request-id :method :url :status :res[content-length] - :response-time ms'),
    )
  }

  app.use(express.json())

  app.use('/api/products', productRoutes)
  app.use('/api/users', userRoutes)
  app.use('/api/orders', orderRoutes)
  app.use('/api/upload', uploadRoutes)
  app.use('/api/contact', contactRoutes)
  app.use('/api/admin', adminRoutes)
  app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

  // Handle meta.json requests for development tools
  app.get('/meta.json', (req, res) => {
    res.json({
      name: 'Ecommerce Frontend',
      version: '1.0.0',
      description: 'Ecommerce application frontend',
    })
  })

  const __dirname = path.resolve()
  app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')),
    )
  } else {
    app.get('/', (req, res) => {
      res.send('API is Runn....')
    })
  }

  app.use(notFound)
  app.use(errorHandler)

  return app
}

export default createApp

