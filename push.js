let webPush = require('web-push');

const vapidKeys = {
   "publicKey": "BDK5LZ9T_Xfl6zmZxyfdJlaiHK-dUzY883tykHDXj1gmCcDrTfCS24eMr0YaqFVEgXQG3QzmK5HEEjqjaIvUBxo",
   "privateKey": "EzOBLIneVnEeXttLrHDKYXPbTmXDPZuVyTBFExeqBWU"
};


webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)

let pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/fCsPKp3KQjM:APA91bFBYNfwZ84pPy5pnX4Tkab9MfPPhnWLuCht8iVkkoIQ9QfKd9OFTlrEoKLgKD6HE3oZfhyiHWjR4rL6fVsPS70VDcNrJY1To9LujDlurCg9VhCDVFzPAv8ztrhS_udwFPgUOJms",
   "keys": {
      "p256dh": "BL/hyp1wPzaZiHCthL1ZuAm8r8WwwJ+1wtoBLsdB3yCfO33IqCuJX2OD4RBXfRJgRghRP9NWS5zIXZcODhiaK9M=",
      "auth": "wi3UmaUrPMKInYS0kyG2yA=="
   }
};
let payload = 'Welcome to The Champions League Info Website';

let options = {
   gcmAPIKey: '11407838466',
   TTL: 60
};

console.log(pushSubscription,
   payload,
   options
)

webPush.sendNotification(
   pushSubscription,
   payload,
   options
);