import mongoose, { type Mongoose } from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"

let mockedMongo

export const connectDB = async (url: string): Promise<Mongoose> => {
  if (process.env.NODE_ENV === "test") {
    mockedMongo = await MongoMemoryServer.create()
    url = mockedMongo.getUri()
  }
  return await mongoose.connect(url)
}

export const disconnectDB = async (): Promise<void> => {
  await mongoose.connection.close()
  if (mockedMongo) {
    await mockedMongo.stop()
  }
}
