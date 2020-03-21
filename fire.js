import firebase from 'firebase'
import firestore from 'firebase/firestore'
const firebaseConfig = {
    apiKey: "AIzaSyBDqpNztib2cxXFmxIgKjJEoQa-wlizHmY",
    authDomain: "top8-api.firebaseapp.com",
    databaseURL: "https://top8-api.firebaseio.com",
    projectId: "top8-api",
    storageBucket: "top8-api.appspot.com",
    messagingSenderId: "189526196176",
    appId: "1:189526196176:web:bec2381e70f04692d6c3d5",
    measurementId: "G-FW0FMZ6PMJ"
  };
var fire = firebase.initializeApp(firebaseConfig);
export default fire;