import './database/connection'
import express from 'express'
import path from 'path'
import 'express-async-errors'
import cors from 'cors'

import { routes } from './routes'
import erroHandler from './errors/handler'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))
app.use(routes)
app.use(erroHandler)

app.listen(3333 || process.env.PORT)
