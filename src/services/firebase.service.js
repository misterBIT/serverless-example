import firebase from 'firebase/app'
import 'firebase/database'

const PUSH_NOTFICATION_URL = 'https://us-central1-serverless-example-952af.cloudfunctions.net/notifySubscriptions'

const config = {
    apiKey: "AIzaSyAUWmOY_UshzqRNvWErwvHJ5xUear9CrRU",
    authDomain: "serverless-example-952af.firebaseapp.com",
    databaseURL: "https://serverless-example-952af.firebaseio.com",
    projectId: "serverless-example-952af",
    storageBucket: "serverless-example-952af.appspot.com",
    messagingSenderId: "680067478208"
  };

firebase.initializeApp(config)

// firebase utils
const db = firebase.database()

const docToObj = (id, doc) => {
    return Object.assign({}, doc, {id})
}

const querySnapshotToSimpleObjects = (querySnapshot) => {
    if (!querySnapshot) return
    return Object.keys(querySnapshot).map((key) => docToObj(key, querySnapshot[key]));
}

const subscribe = (collection, cb) => {
    db.ref(collection).on('value', (snapshot) => {
        const list = querySnapshotToSimpleObjects(snapshot.val())
        cb(list)
    });
}

const add = (collectionName, obj) => {
    return db.ref(collectionName).push(obj)
}

const sendPush = () => {
    return fetch(PUSH_NOTFICATION_URL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({})
    })
    .then(res => res.json())
    .then(res => console.log('Done with fBase function', res))
    .catch(err => {
        console.log('err', err)
        return Promise.reject(error)
    })
} 

export default {
    subscribe,
    add,
    sendPush
}
