const functions = require('firebase-functions');
const cors = require("cors")({ origin: true });
const webpush = require("web-push");
const admin = require("firebase-admin");

admin.initializeApp()

webpush.setVapidDetails(
    'mailto:someemail@email.com',
    'BLc-s9wisrfhmLNoVKa3mqvsv7VxNZU5qFYmR3Wy-1noDQLUlaXwISm5xNx3JvHhUFjGL_sYl8DpKbRl6mZdq1M',
    'XK - MitZjyumXV9Nc9uvKzi29cYYHOz7VVi1ywqTj_lE'
);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.notifySubscriptions = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        admin.database().ref('subscriptions').once('value')
            .then(snapshot => snapshot.val())
            .then(subscriptions => {
                Object.keys(subscriptions).forEach(subId => {
                    var pushConfig = subscriptions[subId]
                    console.log('pushConfig', pushConfig)
                    
                    webpush
                        .sendNotification(
                            pushConfig,
                            JSON.stringify({
                                message: 'New Post',
                                content: 'New Post added!'
                            })
                        )
                        .catch(err => {
                            console.log(err);
                        });
                })
                response.send({msg: 'Done!'});
            })
            .catch(err => {
                console.log(err)
                response.send({err: 'had problem ' + err});
            })
    })
});
