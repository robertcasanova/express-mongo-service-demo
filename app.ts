import "dotenv/config"
import express from "express"
import type { NextFunction, Request, Response } from "express"
import cors from "cors"
import { connectDB } from "./libraries/db"
import { type AddressInfo } from "net"
import { getMoviesAction } from "./pixar"

const isTestEnv = process.env.NODE_ENV === "test"

const mongoUser = process.env.MONGO_USER as string
const mongoPwd = process.env.MONGO_PWD as string
const mongoHost = process.env.MONGO_HOST as string
const mongoPort = process.env.MONGO_PORT as string
const mongoDb = process.env.MONGO_DB as string

const app = express()
// null select a random port so multiple parallel processes can run during test
const port = isTestEnv ? null : process.env.PORT as string

app.use(cors())

app.get("/healthz", (req: Request, res: Response) => {
  res.sendStatus(200)
})

app.get("/movies", getMoviesAction)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
  // https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/centralizedhandling.md#code-example--handling-errors-within-a-dedicated-object
  // @TODO await errorHandler.handleError(err, res);
})

const start = async (): Promise<void> => {
  try {
    const dbUrl = `mongodb://${mongoUser}:${mongoPwd}@${mongoHost}:${mongoPort}/${mongoDb}`
    await connectDB(dbUrl)

    const server = app.listen(port, () => {
      const serverAddress = server.address() as AddressInfo
      console.log(`Application is running on port ${serverAddress.port}.`)
    })
  } catch (err) {
    console.error(err.stack)
    process.exit(1)
    // @TODO await errorHandler.handleError(err, res);
  }
}

void start()

export default app
