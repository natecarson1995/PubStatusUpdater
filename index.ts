import { callbackify } from "node:util";

require("dotenv").config();
const dbAdmin = require('firebase-admin');
dbAdmin.initializeApp();
var db = dbAdmin.firestore();
/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.UpdateStatus = async (event, context) => {
    const message = event.data
        ? Buffer.from(event.data, "base64").toString()
        : null;

    let data = JSON.parse(message);
    if (!data.id) return "Error: no video id specified";

    let docRef = db.collection('videos').doc(data.id);
    let now = Date.now();

    let existingDoc = await docRef.get();
    if (existingDoc.exists) {
        let existingData = existingDoc.data();
        let oldProgress = convertProgressToInt(existingData.status, existingData.data);
        let newProgress = convertProgressToInt(data.status, data.data);
        if (oldProgress > newProgress) {
            return;
        }
    }

    await docRef.set({
        "id": data.id,
        "last-status": data.status,
        "data": data.data,
        "last-accessed": now
    });
    
    context.callback();
    return;
}

function convertProgressToInt(status: string, data: string): number {
    switch (status) {
        case "Started":
            return 0;
        case "Progress":
            return parseInt(data);
        case "Finished":
            return 101;
        default:
            return 0;
    }
}
if (process.env.dev == "TRUE") {
    let data = {
        id: "k85s3gm85rs61",
        status: "Finished",
        data: "Test"
    };
    let buff = Buffer.from(JSON.stringify(data));
    exports.UpdateStatus({data: buff.toString("base64")}, null)
}