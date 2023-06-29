import express, { Request, Response } from 'express';
import { getMovies, getMoviesFilteredByTitle } from './pixar';
import mongoose from 'mongoose';
import cors from "cors";

const app = express();
const port = 3001;
const db = "mongodb://test:test@localhost:27017/pixar"

app.use(cors())

app.get("/healthz", (req: Request, res: Response) => {
  res.sendStatus(200);
})

app.get("/movies", async (req: Request, res: Response) => {
  const query = req.query.q as string|undefined;

  if(!query) {
    const movies = await getMovies();
    return res.status(200).json(movies);
  } 

  const filteredMovies = await getMoviesFilteredByTitle({ q: query })
  
  if(filteredMovies.length === 0) {
    return res.status(404).send("Cannot find movie!");
  }

  return res.status(200).json(filteredMovies);
})

const start = async () => {
  try {
    await mongoose.connect(db)
    
    app.listen(port, () => {
      console.log(`Application is running on port ${port}.`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();

