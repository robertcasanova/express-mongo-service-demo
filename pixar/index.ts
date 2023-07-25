import { getMovies, getMoviesFilteredByTitle } from "./data";

export async function getMoviesAction (req, res, next): Promise<void> {
  try {
    const query = req.query.q as string | undefined;

    if (!query) {
      const movies = await getMovies();
      return res.status(200).json(movies);
    }

    const filteredMovies = await getMoviesFilteredByTitle({ q: query });

    if (filteredMovies.length === 0) {
      return res.status(404).send("Cannot find movie!");
    }

    return res.status(200).json(filteredMovies);
  } catch (err) {
    next(err);
  }
}
