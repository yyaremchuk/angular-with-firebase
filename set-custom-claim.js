var admin = require('firebase-admin');
var uid = process.argv[2];
var serviceAccount = require('./angular-with-firebase-2ae01-firebase-adminsdk-62ab1-d890ac96c3.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://angular-with-firebase-2ae01.firebaseio.com'
});

admin
  .auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('custom claims set for user', uid);
    process.exit();
  })
  .catch(error => {
    console.log('error', error);
    process.exit(1);
  });
