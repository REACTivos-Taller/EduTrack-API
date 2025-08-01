import express, { Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { swaggerUi, swaggerDocs } from '../docs/swagger.js'
import { dbConnection } from './mongo.js'
import triggerRoutes from '../src/trigger/trigger.routes.js'
import registryRoutes from '../src/registry/registry.routes.js'
import apiLimiter from '../src/middleware/rate-limit.js'

const middlewares = (app: Express) => {
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  )
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-eval'", `http://localhost:${process.env.PORT}`],
          connectSrc: ["'self'", `http://localhost:${process.env.PORT}`],
          imgSrc: ["'self'", 'data:'],
          styleSrc: ["'self'", "'unsafe-inline'"],
        },
      },
    }),
  )
  app.use(
    morgan('Server  | :method :statusColor :url :response-time ms - :res[content-length]'),
  ) // Formato de la respuesta
  app.use(apiLimiter)
}

const routes = (app: Express) => {
  app.use('/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
  app.use('/v1/trigger', triggerRoutes)
  app.use('/v1/registries', registryRoutes)
}

const connectDB = async () => {
  try {
    await dbConnection()
  } catch (err) {
    console.log(`Database | Connection failed: ${err}`)
  }
}

export const initServer = () => {
  const app = express()
  try {
    middlewares(app)
    connectDB()
    routes(app)
    app.listen(process.env.PORT)
    console.log(`Server  | Running on port: ${process.env.PORT}`)
  } catch (err) {
    console.log(`Server  | Init failed: ${err}`)
  }
}

morgan.token('statusColor', (req, res, args) => {
  // get the status code if response written
  const status = res.headersSent ? res.statusCode : undefined

  // get status color
  var color =
    status! >= 500 ?
      31 // red
    : status! >= 400 ?
      33 // yellow
    : status! >= 300 ?
      36 // cyan
    : status! >= 200 ?
      32 // green
    : 0 // no color

  return '\x1b[' + color + 'm' + status + '\x1b[0m'
})
