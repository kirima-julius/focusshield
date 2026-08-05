"use strict";


import { initializeApp } from "./lib/firebase-app.js";

import {

    getAuth,

    onAuthStateChanged,

    signInWithEmailAndPassword,

    signOut

} from "./lib/firebase-auth.js";

import {

    getDatabase,

    ref,

    get,

    set,

    push,

    onValue,

    query,

    orderByKey,

    orderByChild,

    equalTo

} from "./lib/firebase-database.js";


/* Firebase configuration */

const firebaseConfig = {

    apiKey: "AIzaSyCRUsRUtcTEI9z38B8tc2e3gWI25hFJNn4",

    authDomain: "focusshield-8d056.firebaseapp.com",

    databaseURL: "https://focusshield-8d056-default-rtdb.europe-west1.firebasedatabase.app",

    projectId: "focusshield-8d056",

    storageBucket: "focusshield-8d056.firebasestorage.app",

    messagingSenderId: "654990453376",

    appId: "1:654990453376:web:1a14b3c5535cb154245465"

};


/* Initialize Firebase */

const app = initializeApp(firebaseConfig);


/* Services */

const auth = getAuth(app);

const database = getDatabase(app);


/* Exports */

export {

    auth,

    database,

    ref,

    get,

    set,

    push,

    onValue,

    query,

    orderByKey,

    orderByChild,

    equalTo,

    onAuthStateChanged,

    signInWithEmailAndPassword,

    signOut

};

