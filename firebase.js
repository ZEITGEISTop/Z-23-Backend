const { initializeApp } =require ("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAgMyVDGzIJKaDjQ591MAU2qikHDoFAEZM",
  authDomain: "zeitgeist-23.firebaseapp.com",
  projectId: "zeitgeist-23",
  storageBucket: "zeitgeist-23.appspot.com",
  messagingSenderId: "670649913658",
  appId: "1:670649913658:web:0d6db416d1126b40aa8003",
  measurementId: "G-W5G9MFPWYJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db=getFirestore(app);
module.exports = {db: db, app: app};