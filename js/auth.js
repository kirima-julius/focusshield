"use strict";


import {

    auth,

    database,

    ref,

    set,

    createUserWithEmailAndPassword,

    signInWithEmailAndPassword,

    signOut,

    onAuthStateChanged,

    updateProfile

} from "./firebase.js";


import {

    saveUserSession,

    removeUserSession

} from "./storage.js";


import {

    ROUTES,

    MESSAGE_TYPES

} from "./config.js";


import { showMessage } from "./ui.js";


/* Sign up */

export async function signUp(username, email, password) {

    const userCredential = await createUserWithEmailAndPassword(

        auth,

        email,

        password

    );

    const user = userCredential.user;


    // Update display name

    if (username) {

        try {

            await updateProfile(user, { displayName: username });

        } catch {

            // Ignore profile update error if non-critical

        }

    }


    await set(

        ref(database, `users/${user.uid}/profile`),

        {

            username,

            email,

            createdAt: Date.now()

        }

    );


    // Initialize default user settings and empty sites list in Firebase

    await set(

        ref(database, `settings/${user.uid}`),

        {

            enabled: true,

            startTime: "09:00",

            endTime: "17:00"

        }

    );


    saveUserSession({

        uid: user.uid,

        username,

        email

    });


    return user;

}


/* Login */

export async function login(email, password) {

    const userCredential = await signInWithEmailAndPassword(

        auth,

        email,

        password

    );

    const user = userCredential.user;


    saveUserSession({

        uid: user.uid,

        username: user.displayName || email.split("@")[0],

        email: user.email

    });


    return user;

}


/* Logout */

export async function logout() {

    await signOut(auth);

    removeUserSession();

}


/* Current user */

export function getCurrentUser() {

    return auth.currentUser;

}


/* Authentication listener */

export function checkAuthentication(callback) {

    onAuthStateChanged(auth, callback);

}


/* Redirect authenticated users */

export function redirectIfAuthenticated() {

    checkAuthentication((user) => {

        if (user) {

            window.location.href = ROUTES.DASHBOARD;

        }

    });

}


/* Redirect guests */

export function redirectIfGuest() {

    checkAuthentication((user) => {

        if (!user) {

            window.location.href = ROUTES.LOGIN;

        }

    });

}


/* Initialize Authentication Forms */

document.addEventListener("DOMContentLoaded", () => {

    initializeAuthentication();

});


function initializeAuthentication() {

    attachSignupForm();

    attachLoginForm();

}


/* Signup Form Listener */

function attachSignupForm() {

    const form = document.getElementById("signup-form");

    if (!form) return;


    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        const usernameInput = document.getElementById("username-input");

        const emailInput = document.getElementById("email-input");

        const passwordInput = document.getElementById("password-input");

        const submitBtn = document.getElementById("signup-btn");


        if (!usernameInput || !emailInput || !passwordInput) return;


        const username = usernameInput.value.trim();

        const email = emailInput.value.trim();

        const password = passwordInput.value;


        try {

            if (submitBtn) submitBtn.disabled = true;

            showMessage("Creating your FocusShield account...", MESSAGE_TYPES.INFO);


            await signUp(username, email, password);


            showMessage("Account created successfully! Redirecting...", MESSAGE_TYPES.SUCCESS);

            setTimeout(() => {

                window.location.href = ROUTES.DASHBOARD;

            }, 800);

        } catch (error) {

            let errorMsg = "Failed to create account. Please check your details.";

            if (error.code === "auth/email-already-in-use") {

                errorMsg = "This email is already registered. Please log in.";

            } else if (error.code === "auth/weak-password") {

                errorMsg = "Password should be at least 6 characters long.";

            } else if (error.code === "auth/invalid-email") {

                errorMsg = "Please enter a valid email address.";

            }

            showMessage(errorMsg, MESSAGE_TYPES.ERROR);

        } finally {

            if (submitBtn) submitBtn.disabled = false;

        }

    });

}


/* Login Form Listener */

function attachLoginForm() {

    const form = document.getElementById("login-form");

    if (!form) return;


    form.addEventListener("submit", async (event) => {

        event.preventDefault();


        const emailInput = document.getElementById("email-input");

        const passwordInput = document.getElementById("password-input");

        const submitBtn = document.getElementById("login-btn");


        if (!emailInput || !passwordInput) return;


        const email = emailInput.value.trim();

        const password = passwordInput.value;


        try {

            if (submitBtn) submitBtn.disabled = true;

            showMessage("Signing in...", MESSAGE_TYPES.INFO);


            await login(email, password);


            showMessage("Signed in successfully! Redirecting...", MESSAGE_TYPES.SUCCESS);

            setTimeout(() => {

                window.location.href = ROUTES.DASHBOARD;

            }, 800);

        } catch (error) {

            let errorMsg = "Invalid email or password.";

            if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {

                errorMsg = "Incorrect email or password. Please try again.";

            } else if (error.code === "auth/invalid-email") {

                errorMsg = "Please enter a valid email address.";

            }

            showMessage(errorMsg, MESSAGE_TYPES.ERROR);

        } finally {

            if (submitBtn) submitBtn.disabled = false;

        }

    });

}
