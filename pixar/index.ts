import movies from "./pixars.json";

export interface Movie {
  title: string;
  year: number;
  length: number;
  score: number;
}

export function getMovies(): Movie[] {
  return movies;
}

