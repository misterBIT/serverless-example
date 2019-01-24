import axios from "axios";

const webpush = {
    mail: 'mailto:someemail@email.com',
    publicKey: 'BLc-s9wisrfhmLNoVKa3mqvsv7VxNZU5qFYmR3Wy-1noDQLUlaXwISm5xNx3JvHhUFjGL_sYl8DpKbRl6mZdq1M',
    privateKey: 'XK - MitZjyumXV9Nc9uvKzi29cYYHOz7VVi1ywqTj_lE'
}

const databaseURL = 'https://serverless-example-952af.firebaseio.com'

if ('Notification' in window) {
  console.log('Notification is supported!');

  // if you using sw, better to add this 'navigator.serviceWorker.ready' before the request to permissions
  Notification.requestPermission(results => {
    console.log('notifications permisstions: ', results);

    if (results === 'denied') {
      console.log('notifications permisstions denied!');
      return;
    }

    configurePushSub();
  });
}

// register to listen to incoming push message from server
function configurePushSub() {
  if (!('serviceWorker' in navigator)) return;

  var reg;
  navigator.serviceWorker.ready
    .then(swreg => {
      console.log('NOTIF: SW Ready');
      reg = swreg;
      return swreg.pushManager.getSubscription();
    })
    .then(sub => {
      console.log('NOTIF: sub', !!sub);
      if (sub) return;

      var vapidPublicKey = webpush.publicKey;
      // create new one. when creating new one need to protect the push messages
      var convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
      return reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidPublicKey
      });
    })
    .then(newSub => {
      if (!newSub) return;
      console.log('NOTIF: newSub', newSub);
      return axios.post(`${databaseURL}/subscriptions.json`, newSub)
      // return fetch(`${databaseURL}/subscriptions.json`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Accept: 'application/json'
      //   },
      //   body: JSON.stringify(newSub)
      // });
    })
    .then(res => {
      if (res && res.ok) {
        console.log('subscription added successfully');
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  // eslint-disable-next-line
  var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
