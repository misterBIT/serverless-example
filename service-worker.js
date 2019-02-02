importScripts("/serverless-example/precache-manifest.c16928f3557075f5437be68724d6245d.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

console.log('INSIDE service-worker.js')

// self.addEventListener("install", event => {
//   console.log("!!!! SW INSTALL");
// });

self.addEventListener("push", event => {
    console.log("!!!! Push Notification received");
  
    var data = {
      title: "Election Ended!",
      content: "Check it out now :)",
      openUrl: "/"
    };
  
    var options = {
      body: data.content,
      data: {
        url: data.openUrl
      },
      actions: [
        {
          action: "confirm",
          title: "Buy Ticket"
        },
        {
          action: "cancel",
          title: "Changed my Mind"
        }
      ]
    };
  
    event.waitUntil(self.registration.showNotification(data.title, options));
  });


