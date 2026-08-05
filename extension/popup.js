"use strict";

import {

    auth,

    database,

    ref,

    get,

    signInWithEmailAndPassword,

    signOut,

    onAuthStateChanged

} from "./firebase.js";

import {

    FIREBASE_PATHS,

    DASHBOARD_URL

} from "./config.js";

/* Login View */

const loginView = document.getElementById("login-view");

/* Dashboard View */

const dashboardView = document.getElementById("dashboard-view");

/* Login Form */

const loginForm = document.getElementById("login-form");

/* Email */

const emailInput = document.getElementById("email");

/* Password */

const passwordInput = document.getElementById("password");

/* Login Message */

const loginMessage = document.getElementById("login-message");

/* Status */

const extensionStatus = document.getElementById("extension-status");

/* Schedule */

const scheduleStart = document.getElementById("schedule-start");

const scheduleEnd = document.getElementById("schedule-end");

/* Blocked Sites */

const blockedSitesCount = document.getElementById("blocked-sites-count");

/* Buttons */

const openDashboardButton = document.getElementById("open-dashboard-btn");

const logoutButton = document.getElementById("logout-btn");



/* Initialize */

initializePopup();

/* Initialize Popup */

function initializePopup() {

    onAuthStateChanged(

        auth,

        async (user) => {

            if (!user) {

                showLoginView();

                return;

            }

            showDashboardView();

            await loadDashboardData(user.uid);

        }

    );

    if (loginForm) {

        loginForm.addEventListener(

            "submit",

            handleLogin

        );

    }

    if (logoutButton) {

        logoutButton.addEventListener(

            "click",

            handleLogout

        );

    }

    if (openDashboardButton) {

        openDashboardButton.addEventListener(

            "click",

            openDashboard

        );

    }

}

/* Login */

async function handleLogin(event) {

    event.preventDefault();

    if (loginMessage) loginMessage.textContent = "";

    try {

        await signInWithEmailAndPassword(

            auth,

            emailInput.value.trim(),

            passwordInput.value

        );

    }

    catch (error) {

        if (loginMessage) loginMessage.textContent = error.message;

    }

}

/* Logout */

async function handleLogout() {

    try {

        await signOut(auth);

    }

    catch (error) {

        console.error("Logout error:", error);

    }

}

/* Open Dashboard */

function openDashboard() {

    chrome.tabs.create({

        url: DASHBOARD_URL

    });

}

/* Show Login View */

function showLoginView() {

    if (loginView) loginView.style.display = "block";

    if (dashboardView) dashboardView.style.display = "none";

}

/* Show Dashboard View */

function showDashboardView() {

    if (loginView) loginView.style.display = "none";

    if (dashboardView) dashboardView.style.display = "block";

}

/* Load Dashboard Data */

async function loadDashboardData(userId) {

    await loadSettings(userId);

    await loadBlockedSites(userId);

}

/* Load Settings */

async function loadSettings(userId) {

    try {

        const snapshot = await get(

            ref(

                database,

                `${FIREBASE_PATHS.SETTINGS}/${userId}`

            )

        );

        if (!snapshot.exists()) {

            if (extensionStatus) {

                extensionStatus.textContent = "Disabled";

                extensionStatus.className = "status-badge disabled";

            }

            if (scheduleStart) scheduleStart.textContent = "--:--";

            if (scheduleEnd) scheduleEnd.textContent = "--:--";

            return;

        }

        const settings = snapshot.val();

        if (extensionStatus) {

            extensionStatus.textContent = settings.enabled ? "Active" : "Disabled";

            extensionStatus.className = settings.enabled ? "status-badge active" : "status-badge disabled";

        }

        if (scheduleStart) scheduleStart.textContent = settings.startTime || "--:--";

        if (scheduleEnd) scheduleEnd.textContent = settings.endTime || "--:--";

    }

    catch (error) {

        console.error("Failed to load settings:", error);

    }

}

/* Load Blocked Sites */

async function loadBlockedSites(userId) {

    try {

        const snapshot = await get(

            ref(

                database,

                `${FIREBASE_PATHS.BLOCKED_SITES}/${userId}`

            )

        );

        if (!snapshot.exists()) {

            if (blockedSitesCount) blockedSitesCount.textContent = "0 Sites";

            return;

        }

        const websites = Object.values(snapshot.val());

        if (blockedSitesCount) blockedSitesCount.textContent = `${websites.length} Sites`;

    }

    catch (error) {

        console.error("Failed to load blocked sites:", error);

    }

}
