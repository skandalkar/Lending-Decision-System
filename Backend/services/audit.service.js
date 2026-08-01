import { getMongoDatabase } from "../config/mongodb.js";

export async function recordAuditEvent({
    applicationId,
    eventType,
    requestId,
    data = {}
}) {
    const database = getMongoDatabase();

    await database.collection("audit_events").insertOne({
        applicationId,
        eventType,
        requestId,
        data,
        createdAt: new Date()
    });
}