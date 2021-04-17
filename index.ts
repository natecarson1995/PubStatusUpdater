require("dotenv").config();

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.CombineVideos = async (event, context) => {
    const message = event.data
        ? Buffer.from(event.data, "base64").toString()
        : null;

    let data = JSON.parse(message);
    if (!data.id) return "Error: no video id specified";
}