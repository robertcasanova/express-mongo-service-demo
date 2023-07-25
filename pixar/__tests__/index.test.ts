import supertest from "supertest";
import app, { server } from "../../app";
import { connectMockedDB, disconnectDB } from "../../libraries/db";
import mongoose from "mongoose";
import { Movie } from "../data";

const testServer = supertest(app);

describe("Pixar API", () => {
  beforeAll(async () => {
    await connectMockedDB();
    const db = mongoose.connection.db;
    await db.createIndex("movies", { title: "text" });
  });

  afterAll(async () => {
    // await Movie.deleteMany();
    await disconnectDB();
    server.close();
  });

  describe("GET /movies", () => {
    beforeAll(async () => {
      await Movie.insertMany([{
        year: 1995,
        title: "Toy Story",
        length: 81,
        score: 8.3
      },
      {
        year: 1998,
        title: "A Bug's Life",
        length: 96,
        score: 7.2
      },
      {
        year: 1999,
        title: "Toy Story 2",
        length: 92,
        score: 7.9
      }]);
    });
    it("should return all movies by default", async () => {
      const res = await testServer.get("/movies");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body[0]).toEqual(
        expect.objectContaining({
          year: 1995,
          title: "Toy Story",
          length: 81,
          score: 8.3
        }));
      expect(res.body[1]).toEqual(
        expect.objectContaining({
          year: 1998,
          title: "A Bug's Life",
          length: 96,
          score: 7.2
        }));
      expect(res.body[2]).toEqual(
        expect.objectContaining({
          year: 1999,
          title: "Toy Story 2",
          length: 92,
          score: 7.9
        }));
    });
    it("should return movies filtered by query if q param is passed", async () => {
      const res = await testServer.get("/movies?q=toy");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toEqual(
        expect.objectContaining({
          year: 1995,
          title: "Toy Story",
          length: 81,
          score: 8.3
        }));
      expect(res.body[1]).toEqual(
        expect.objectContaining({
          year: 1999,
          title: "Toy Story 2",
          length: 92,
          score: 7.9
        }));
    });
    it("should return 404 if no movies match the q param", async () => {
      const res = await testServer.get("/movies?q=nomatch");
      expect(res.status).toBe(404);
    });
  });
});
