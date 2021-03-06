"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
require("dotenv").config();
var dbAdmin = require('firebase-admin');
dbAdmin.initializeApp();
var db = dbAdmin.firestore();
/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.UpdateStatus = function (event, context) { return __awaiter(void 0, void 0, void 0, function () {
    var message, data, docRef, now, existingDoc, existingData, oldProgress, newProgress;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                message = event.data
                    ? Buffer.from(event.data, "base64").toString()
                    : null;
                data = JSON.parse(message);
                if (!data.id)
                    return [2 /*return*/, "Error: no video id specified"];
                docRef = db.collection('videos').doc(data.id);
                now = Date.now();
                return [4 /*yield*/, docRef.get()];
            case 1:
                existingDoc = _a.sent();
                if (existingDoc.exists) {
                    existingData = existingDoc.data();
                    oldProgress = convertProgressToInt(existingData.status, existingData.data);
                    newProgress = convertProgressToInt(data.status, data.data);
                    if (oldProgress > newProgress) {
                        return [2 /*return*/];
                    }
                }
                return [4 /*yield*/, docRef.set({
                        "id": data.id,
                        "last-status": data.status,
                        "data": data.data,
                        "last-accessed": now
                    })];
            case 2:
                _a.sent();
                context.callback();
                return [2 /*return*/];
        }
    });
}); };
function convertProgressToInt(status, data) {
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
    var data = {
        id: "k85s3gm85rs61",
        status: "Finished",
        data: "Test"
    };
    var buff = Buffer.from(JSON.stringify(data));
    exports.UpdateStatus({ data: buff.toString("base64") }, null);
}
