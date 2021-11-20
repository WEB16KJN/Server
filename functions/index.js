const functions = require("firebase-functions");
const serviceAccount=require("./doosungpaper-1bf1e-firebase-adminsdk-mk8uk-5dfa986df5");
const dotenv=require("dotenv");

dotenv.config();

let firebase;

if (admin.apps.length === 0) {
    firebase = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount), 
    });
  } else {
    firebase = admin.app();
  }
  
  module.exports = {
    api: require("./api"),
  };