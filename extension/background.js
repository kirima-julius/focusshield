"use strict";

import {

    auth,

    database,

    ref,

    get,

    push,

    set,

    onAuthStateChanged

} from "./firebase.js";

import {

    FIREBASE_PATHS,

    SUPPORTED_SOCIAL_MEDIA,

    CHECK_INTERVAL,

    TAB_UPDATE_DELAY,

    BLOCKED_PAGE

} from "./config.js";

/* Current user */

let currentUser = null;

/* User settings */

let userSettings = {

    enabled: false,

    startTime: "08:00",

    endTime: "17:00"

};

/* Blocked websites */

let blockedWebsites = [];

/* Initialize */

initializeBackground();

/* Initialize Background */

function initializeBackground() {

    onAuthStateChanged(

        auth,

        async (user) => {

            currentUser = user;

            if (!currentUser) {

                blockedWebsites = [];

                return;

            }

            await synchronizeUserData();

        }

    );

}

/* Synchronize User Data */

async function synchronizeUserData() {

    if (!currentUser) {

        return;

    }

    await loadUserSettings();

    await loadBlockedWebsites();

}

/* Load User Settings */

async function loadUserSettings() {

    const snapshot = await get(

        ref(

            database,

            `${FIREBASE_PATHS.SETTINGS}/${currentUser.uid}`

        )

    );

    if (!snapshot.exists()) {

        userSettings = {

            enabled: false,

            startTime: "08:00",

            endTime: "17:00"

        };

        return;

    }

    userSettings = snapshot.val();

}

/* Load Blocked Websites */

async function loadBlockedWebsites() {

    const snapshot = await get(

        ref(

            database,

            `${FIREBASE_PATHS.BLOCKED_SITES}/${currentUser.uid}`

        )

    );

    if (!snapshot.exists()) {

        blockedWebsites = [];

        return;

    }

    blockedWebsites = Object.values(

        snapshot.val()

    );

}

/* Check Website */

function isBlockedWebsite(hostname) {

    return blockedWebsites.some(

        (website) => hostname.includes(website)

    );

}

/* Check Supported Website */

function isSupportedWebsite(hostname) {

    return SUPPORTED_SOCIAL_MEDIA.some(

        (website) => hostname.includes(website)

    );

}

/* Check Schedule */

function isWithinSchedule() {

    if (!userSettings.enabled) {

        return false;

    }

    const now = new Date();

    const currentMinutes =

        now.getHours() * 60 +

        now.getMinutes();

    const start =

        convertTimeToMinutes(

            userSettings.startTime

        );

    const end =

        convertTimeToMinutes(

            userSettings.endTime

        );

    if (start === end) {

        return true;

    }

    if (start < end) {

        return currentMinutes >= start &&

            currentMinutes < end;

    }

    return currentMinutes >= start ||

        currentMinutes < end;

}

/* Convert Time */

function convertTimeToMinutes(time) {

    const [

        hours,

        minutes

    ] = time.split(":").map(Number);

    return (hours * 60) + minutes;

}

/* Should Block Website */

function shouldBlockWebsite(hostname) {

    if (!isSupportedWebsite(hostname)) {

        return false;

    }

    if (!isBlockedWebsite(hostname)) {

        return false;

    }

    return isWithinSchedule();

}

/* Get Blocked Page URL */

function getBlockedPageURL(url) {

    const blockedURL = chrome.runtime.getURL(

        BLOCKED_PAGE

    );

    return `${blockedURL}?url=${encodeURIComponent(url)}`;

}

/* Handle Tab */

async function handleTab(tabId, url) {

    if (!currentUser) {

        return;

    }

    if (!url) {

        return;

    }

    if (

        url.startsWith("chrome://") ||

        url.startsWith("chrome-extension://") ||

        url.startsWith("edge://") ||

        url.startsWith("about:")

    ) {

        return;

    }

    let hostname;

    try {

        hostname = new URL(url).hostname;

    }

    catch {

        return;

    }

    if (!shouldBlockWebsite(hostname)) {

        return;

    }


    await logAttempt(hostname);


    await chrome.tabs.update(

        tabId,

        {

            url: getBlockedPageURL(url)

        }

    );

}


/* Log Attempt */

async function logAttempt(hostname) {

    if (!currentUser) {

        return;

    }

    try {

        const attemptsRef = ref(

            database,

            `${FIREBASE_PATHS.BLOCKED_ATTEMPTS}/${currentUser.uid}`

        );

        const newAttemptRef = push(attemptsRef);

        await set(newAttemptRef, {

            domain: hostname,

            timestamp: Date.now()

        });

    } catch {

        // Ignore write failures offline

    }

}

/* Tab Updated */

chrome.tabs.onUpdated.addListener(

    (tabId, changeInfo, tab) => {

        if (

            changeInfo.status !== "complete"

        ) {

            return;

        }

        setTimeout(

            () => {

                handleTab(

                    tabId,

                    tab.url

                );

            },

            TAB_UPDATE_DELAY

        );

    }

);

/* Navigation Completed */

chrome.webNavigation.onCompleted.addListener(

    (details) => {

        if (

            details.frameId !== 0

        ) {

            return;

        }

        chrome.tabs.get(

            details.tabId,

            (tab) => {

                if (

                    chrome.runtime.lastError ||

                    !tab

                ) {

                    return;

                }

                handleTab(

                    tab.id,

                    tab.url

                );

            }

        );

    }

);

/* Synchronize Extension */

async function synchronizeExtension() {

    if (!currentUser) {

        return;

    }

    await synchronizeUserData();

    const tabs = await chrome.tabs.query({});

    for (const tab of tabs) {

        if (!tab.id || !tab.url) {

            continue;

        }

        await handleTab(

            tab.id,

            tab.url

        );

    }

}

/* Create Alarm */

chrome.runtime.onInstalled.addListener(

    () => {

        chrome.alarms.create(

            "focusshield-sync",

            {

                periodInMinutes: CHECK_INTERVAL / 60000

            }

        );

    }

);

chrome.runtime.onStartup.addListener(

    () => {

        chrome.alarms.create(

            "focusshield-sync",

            {

                periodInMinutes: CHECK_INTERVAL / 60000

            }

        );

    }

);

/* Alarm Listener */

chrome.alarms.onAlarm.addListener(

    async (alarm) => {

        if (

            alarm.name !== "focusshield-sync"

        ) {

            return;

        }

        await synchronizeExtension();

    }

);

/* Initial Synchronization */

synchronizeExtension();