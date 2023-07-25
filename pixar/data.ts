import { Schema, model } from "mongoose";

export interface IMovie {
  title: string
  year: number
  length: number
  score: number
}

const movieSchema = new Schema<IMovie>({
  title: { type: String, required: true },
  year: { type: Number, required: true },
  length: { type: Number, required: true },
  score: { type: Number, required: true }
});

export const Movie = model<IMovie>("Movie", movieSchema);

export async function getMovies (): Promise<IMovie[]> {
  return await Movie.find();
}

export async function getMoviesFilteredByTitle ({ q }: { q: string }): Promise<IMovie[]> {
  return await Movie.find({ $text: { $search: q } }).sort({ score: -1 });
}
