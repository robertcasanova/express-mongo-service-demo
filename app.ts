import express, { Request, Response, NextFunction } from 'express';
import { getMovies } from './pixar';

const app = express();
const port = 3000;

app.get("/healthz", (req: Request, res: Response) => {
  res.sendStatus(200);
})

app.get("/movies", (req: Request, res: Response) => {
  const movies = getMovies();
  res.status(200).json(movies);
})

app.listen(port, () => {
  console.log(`Timezones by location application is running on port ${port}.`);
});
