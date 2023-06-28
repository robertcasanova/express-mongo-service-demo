import express, { Request, Response, NextFunction } from 'express';
import { getMovies } from './pixar';

const app = express();
const port = 3000;

app.get("/healthz", (req: Request, res: Response) => {
  res.sendStatus(200);
})

app.get("/movies", (req: Request, res: Response) => {
  const movies = getMovies();
  const query = req.query.q as string|undefined;
  if(!query) {
    return res.status(200).json(movies);
  } 

  const filteredMovies = movies.filter(film => film.title.match(new RegExp(query,"i")))
  
  if(filteredMovies.length === 0) {
    return res.status(404).send("Cannot find movie!");
  }

  return res.status(200).json(filteredMovies);
})

app.listen(port, () => {
  console.log(`Timezones by location application is running on port ${port}.`);
});
