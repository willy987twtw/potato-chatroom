import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyDJsSy-Yx5kA95C4ixotoreAOoCSDX6Twg',
  authDomain: 'potato-chatroom.firebaseapp.com',
  projectId: 'potato-chatroom',
  storageBucket: 'potato-chatroom.appspot.com',
  messagingSenderId: '570591132864',
  appId: '1:570591132864:web:8572d473306e8555138125',
};
firebase.initializeApp(firebaseConfig);

const projectAuth = firebase.auth();
const projectFirestore = firebase.firestore();
const projectDatabase = firebase.database();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;
const fieldPath = firebase.firestore.FieldPath;

export { projectDatabase, projectAuth, projectFirestore, timestamp, fieldPath };
