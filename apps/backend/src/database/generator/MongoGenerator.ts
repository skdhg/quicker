import mongoose from "mongoose";
import { getType } from "../../utils/type";

export type MongodbSerializedData = {
  collection: string;
  data: Array<{
    name: string;
    value: string;
    embedded?: MongodbSerializedData[];
  }>;
};

export class MongoGenerator {
  public constructor(public url: string) {}

  public async serializeCollections(
    mongo: mongoose.Connection,
    name: string,
    visited = new Set<string>()
  ): Promise<MongodbSerializedData> {
    if (visited.has(name)) {
      return { collection: name, data: [] };
    }

    const col = mongo.collection(name);
    const res = await col.findOne();

    if (!res) {
      return { collection: name, data: [] };
    }

    visited.add(name);

    const data = Object.entries(res);

    const serialized = await Promise.all(
      data.map(async ([name, value]) => {
        if (mongoose.isObjectIdOrHexString(value)) {
          return {
            name,
            value: "reference",
            refCollection: value.collection?.name,
          };
        } else if (Array.isArray(value)) {
          const embeddedData = await this.serializeCollections(
            mongo,
            name,
            visited
          );
          return { name, value: "array", embedded: [embeddedData] };
        } else if (
          typeof value === "object" &&
          Object.values(value).some((o) => mongoose.isObjectIdOrHexString(o))
        ) {
          const embeddedData = await this.serializeCollections(
            mongo,
            name,
            visited
          );
          return { name, value: "document", embedded: [embeddedData] };
        } else {
          return { name, value: getType(value) };
        }
      })
    );

    return { collection: name, data: serialized };
  }

  public async generate() {
    const mongo = await mongoose
      .createConnection(this.url, {
        connectTimeoutMS: 10_000,
      })
      .asPromise();

    try {
      const collections = await mongo.db.listCollections().toArray();

      const data = await Promise.all(
        collections.map((c) => this.serializeCollections(mongo, c.name))
      );

      return data;
    } finally {
      await mongo.close(true);
    }
  }
}
