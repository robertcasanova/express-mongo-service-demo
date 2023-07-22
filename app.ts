import 'dotenv/config'
import express from 'express'
import type { NextFunction, Request, Response } from 'express'
import { getMovies, getMoviesFilteredByTitle } from './pixar'
import mongoose from 'mongoose'
import cors from 'cors'

const app = express()
const port = process.env.PORT as string
const mongoUser = process.env.MONGO_USER as string
const mongoPwd = process.env.MONGO_PWD as string
const mongoHost = process.env.MONGO_HOST as string
const mongoPort = process.env.MONGO_PORT as string
const mongoDb = process.env.MONGO_DB as string
const db = `mongodb://${mongoUser}:${mongoPwd}@${mongoHost}:${mongoPort}/${mongoDb}`

app.use(cors())

app.get('/healthz', (req: Request, res: Response) => {
  res.sendStatus(200)
})

app.get('/movies', async (req, res, next) => {
  try {
    const query = req.query.q as string | undefined

    if (!query) {
      const movies = await getMovies()
      return res.status(200).json(movies)
    }

    const filteredMovies = await getMoviesFilteredByTitle({ q: query })

    if (filteredMovies.length === 0) {
      return res.status(404).send('Cannot find movie!')
    }

    return res.status(200).json(filteredMovies)
  } catch (err) {
    next(err)
  }
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
  // https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/centralizedhandling.md#code-example--handling-errors-within-a-dedicated-object
  // @TODO await errorHandler.handleError(err, res);
})

const start = async (): Promise<void> => {
  try {
    await mongoose.connect(db)

    app.listen(port, () => {
      console.log(`Application is running on port ${port}.`)
    })
  } catch (err) {
    process.exit(1)
  }
}

void start()
