"use strict";

// FIREBASE IMPORTS

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import { 

    getAuth,

    signOut,

    onAuthStateChanged,

    createUserWithEmailAndPassword,

    signInWithEmailAndPassword,

    updateProfile

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { 

    getDatabase,

    ref,

    set,

    get,

    update,

    remove,

    push,

    child,

    onValue

} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


// FIREBASE CONFIGURATION

const firebaseConfig = {

    apiKey: "AIzaSyCRUsRUtcTEI9z38B8tc2e3gWI25hFJNn4",

    authDomain: "focusshield-8d056.firebaseapp.com",

    databaseURL: "https://focusshield-8d056-default-rtdb.europe-west1.firebasedatabase.app",

    projectId: "focusshield-8d056",

    storageBucket: "focusshield-8d056.firebasestorage.app",

    messagingSenderId: "654990453376",

    appId: "1:654990453376:web:1a14b3c5535cb154245465"

};


// INITIALIZE FIREBASE  

const app = initializeApp(firebaseConfig);


// FIREBASE SERVICES

const auth = getAuth(app);

const database = getDatabase(app);


// EXPORT ALL REQUIRED FIREBASE SERVICES & FUNCTIONS

export {

    auth,

    app,

    database,

    ref,

    set,

    get,

    update,

    remove,

    push,

    child,

    onValue,

    signOut,

    onAuthStateChanged,

    createUserWithEmailAndPassword,

    signInWithEmailAndPassword,

    updateProfile

};
