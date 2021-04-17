require("dotenv").config();
const dbAdmin = require('firebase-admin');
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

    dbAdmin.initializeApp();

    let db = dbAdmin.firestore();
    let docRef = db.collection('videos').doc(data.id);

    await docRef.set({
        "id": data.id,
        "last-status": data.status,
        "data": data.data,
        "last-accessed": Date.now()
    });
    return;
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