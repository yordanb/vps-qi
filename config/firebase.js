const admin = require('firebase-admin');
const serviceAccount = require('./mte-qiagent-01-firebase-adminsdk-lnolu-abbe167ae9.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
