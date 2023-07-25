import http from "http";
import "dotenv/config";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import { connectDB as connectRealDB } from "./libraries/db";
import { type AddressInfo } from "net";
import { getMoviesAction } from "./pixar";

const isTestEnv = process.env.NODE_ENV === "test";

const mongoUser = process.env.MONGO_USER as string;
const mongoPwd = process.env.MONGO_PWD as string;
const mongoHost = process.env.MONGO_HOST as string;
const mongoPort = process.env.MONGO_PORT as string;
const mongoDb = process.env.MONGO_DB as string;
const dbUrl = `mongodb://${mongoUser}:${mongoPwd}@${mongoHost}:${mongoPort}/${mongoDb}`;

const app = express();
// null select a random port so multiple parallel processes can run during test
const port = isTestEnv ? null : process.env.PORT as string;

app.use(cors());

app.get("/healthz", (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.get("/movies", getMoviesAction);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
  // https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/centralizedhandling.md#code-example--handling-errors-within-a-dedicated-object
  // @TODO await errorHandler.handleError(err, res);
});

// I  used this syntax rather than app.listen so I can export server for test usage
export const server = http.createServer(app);

// connect to mocked DB is handled inside tests, skip here
const connectDB = isTestEnv ? async () => { await Promise.resolve(); } : connectRealDB;

connectDB(dbUrl).then(() => {
  server.listen(port, () => {
    const serverAddress = server.address() as AddressInfo;
    console.log(`Application is running on port ${serverAddress.port}.`);
  });
}).catch(err => {
  console.error(err.stack);
  process.exit(1);
  // @TODO await errorHandler.handleError(err, res);
});

export default app;
