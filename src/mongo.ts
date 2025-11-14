import { Db, MongoClient } from "mongodb";

let client: MongoClient;

let db: Db;


export const connectToMongoDB = async (): Promise<void> => {
  try {
    const urlMongo = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.CLUSTER}.l2r3r2m.mongodb.net/?appName=${process.env.CLUSTER_NAME}`;

    client = new MongoClient(urlMongo);

    await client.connect();

    db = client.db("P3");

    console.log("Conexión a MongoDB lista.");

  } catch (err) {

    console.error("No se pudo conectar a Mongo:", err);

    process.exit(1);

  }
};

export const getDB = (): Db => db;
