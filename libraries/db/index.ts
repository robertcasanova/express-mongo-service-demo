import mongoose, { type Mongoose } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mockedMongo;

export const connectDB = async (url: string): Promise<Mongoose | null> => {
  return await mongoose.connect(url);
};

export const connectMockedDB = async (): Promise<Mongoose> => {
  mockedMongo = await MongoMemoryServer.create();
  const url = mockedMongo.getUri();
  return await mongoose.connect(url);
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.connection.close();
  if (mockedMongo) {
    await mockedMongo.stop();
  }
};
