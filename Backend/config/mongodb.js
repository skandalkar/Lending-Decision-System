import { MongoClient } from "mongodb";
import { env } from "./env.js";

export const mongoClient = new MongoClient(env.mongodb.uri);

let database;

export async function connectMongoDB() {
    await mongoClient.connect();
    database = mongoClient.db(env.mongodb.database);
    await database.collection("audit_events").createIndex(
        {
            applicationId: 1,
            createdAt: -1
        }
    );
}

export function getMongoDatabase() {
    if (!database) {
        throw new Error("MongoDB has not been connected.");
    }

    return database;
}