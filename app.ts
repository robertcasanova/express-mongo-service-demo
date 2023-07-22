import express from 'express'
import type { Request, Response } from 'express'
import { getMovies, getMoviesFilteredByTitle } from './pixar'
import mongoose from 'mongoose'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3001
const mongoUser = process.env.MONGO_USER || 'test'
const mongoPwd = process.env.MONGO_PWD || 'test'
const mongoHost = process.env.MONGO_HOST || 'localhost'
const mongoPort = process.env.MONGO_PORT || '27017'
const mongoDb = process.env.MONGO_DB || 'pixar'
const db = `mongodb://${mongoUser}:${mongoPwd}@${mongoHost}:${mongoPort}/${mongoDb}`

app.use(cors())

app.get('/healthz', (req: Request, res: Response) => {
  res.sendStatus(200)
})

app.get('/movies', async (req, res) => {
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
})

const start = async (): Promise<void> => {
  try {
    await mongoose.connect(db)

    app.listen(port, () => {
      console.log(`Application is running on port ${port}.`)
    })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

void start()
