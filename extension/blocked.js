"use strict";

import {

    auth,

    database,

    ref,

    get,

    onAuthStateChanged

} from "./firebase.js";

import {

    FIREBASE_PATHS,

    DASHBOARD_URL

} from "./config.js";

/* Blocked Website */

const blockedWebsite = document.getElementById("blocked-website");

/* Start Time */

const blockedStartTime = document.getElementById("blocked-start-time");

/* End Time */

const blockedEndTime = document.getElementById("blocked-end-time");

/* Status */

const blockedStatus = document.getElementById("blocked-status");

/* Dashboard Button */

const openDashboardButton = document.getElementById("open-dashboard-btn");

/* Initialize */

initializeBlockedPage();

/* Initialize Blocked Page */

function initializeBlockedPage() {

    displayBlockedWebsite();

    onAuthStateChanged(

        auth,

        async (user) => {

            if (!user) {

                blockedStatus.textContent = "User Not Signed In";

                return;

            }

            await loadBlockingSchedule(

                user.uid

            );

        }

    );

    openDashboardButton.addEventListener(

        "click",

        openDashboard

    );

}

/* Display Website */

function displayBlockedWebsite() {

    const parameters = new URLSearchParams(

        window.location.search

    );

    const url = parameters.get("url");

    if (!url) {

        return;

    }

    try {

        const hostname = new URL(url).hostname;

        blockedWebsite.textContent = hostname;

    }

    catch {

        blockedWebsite.textContent = url;

    }

}

/* Load Blocking Schedule */

async function loadBlockingSchedule(uid) {

    const snapshot = await get(

        ref(

            database,

            `${FIREBASE_PATHS.SETTINGS}/${uid}`

        )

    );

    if (!snapshot.exists()) {

        return;

    }

    const settings = snapshot.val();

    blockedStartTime.textContent =

        settings.startTime;

    blockedEndTime.textContent =

        settings.endTime;

    blockedStatus.textContent =

        settings.enabled

            ? "Blocking Active"

            : "Blocking Disabled";

}

/* Open Dashboard */

function openDashboard() {

    window.open(

        DASHBOARD_URL,

        "_blank"

    );

}