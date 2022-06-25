import * as admin from "firebase-admin";
const serviceAccount = require("./la-flor-creation-firebase-adminsdk-dg3cg-2ce5607843.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export { admin };