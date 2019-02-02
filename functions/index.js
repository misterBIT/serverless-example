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

// Cloud Function to send Push Notifications!
exports.notifySubscriptions = functions.https.onRequest((request, response) => {
    // Allow cross origin
    cors(request, response, () => {

        // Read the subscriptions 
        admin.database().ref('subscriptions').once('value')
            // Get the value
            .then(snapshot => snapshot.val())
            // For each subscription - sendNotification
            .then(subscriptions => {
                Object.keys(subscriptions).forEach(subId => {
                    
                    var pushConfig = subscriptions[subId]
                    // console.log('pushConfig', pushConfig)
                    
                    webpush
                        .sendNotification(
                            pushConfig,
                            JSON.stringify({
                                message: 'Election Done!',
                                content: 'Come have a look'
                            })
                        )
                        .catch(err => {
                            console.log('Cannot push to this Subscvriber', err);
                        });
                })
                response.send({msg: 'Done sending Notifications!'});
            })
            .catch(err => {
                console.log(err)
                response.send({err: 'had problem ' + err});
            })
    })
});
