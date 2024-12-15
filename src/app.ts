import createError from 'http-errors'
import express, { Request, Response, NextFunction } from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'

import { fileURLToPath } from 'url'

import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'

import morganMiddleware from './middlewares/morgan.js'
import logger from './configs/winton.js'

const app = express()

const filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(filename)

// view engine setup
app.set('views', path.join(__dirname, '../src', 'views'))
app.set('view engine', 'jade')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

app.use(morganMiddleware)

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404))
})

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  const status: number = err.status || 500
  const message: string = err.message || 'Something went wrong!'
  // res.locals.error = req.app.get('env') === 'development' ? err : {}

  logger.error(`${status} due to ${message}`)

  // render the error page
  // res.status(err.status || 500)
  // res.render('error')

  res.status(status).json({
    success: false,
    status,
    message,
  })
})

export default app
