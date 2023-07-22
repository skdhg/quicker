import { HttpException } from "../utils/HttpException";
import { DatabaseType, HttpStatus } from "../utils/constants";
import { MongoGenerator } from "./generator/MongoGenerator";

export async function generateStructure(database: string, type: DatabaseType) {
  switch (type) {
    case DatabaseType.Mongodb:
      const db = new MongoGenerator(database);
      return await db.generate();
    default:
      throw new HttpException("Invalid database type", HttpStatus.BAD_REQUEST);
  }
}
