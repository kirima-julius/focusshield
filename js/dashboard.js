"use strict";


import {

    auth,

    database,

    ref,

    get,

    set,

    onValue,

    signOut,

    onAuthStateChanged

} from "./firebase.js";


import {

    FIREBASE_PATHS,

    MESSAGE_TYPES,

    ROUTES

} from "./config.js";


import {

    showMessage,

    updateUsername,

    updateBlockingStatus,

    renderBlockedSites,

    updateMetrics,

    clearForm,

    disableButton,

    enableButton

} from "./ui.js";


/* State */

let currentUser = null;

let currentBlockedWebsites = [];

let currentHitCountsMap = {};

let currentSettings = { enabled: false, startTime: "09:00", endTime: "17:00" };

let currentAttemptsList = [];

let searchFilterQuery = "";

let timerInterval = null;


/* DOM Elements */

const logoutButton = document.getElementById("logout-btn");

const settingsForm = document.getElementById("settings-form");

const blockingToggle = document.getElementById("blocking-toggle");

const startTimeInput = document.getElementById("start-time-input");

const endTimeInput = document.getElementById("end-time-input");

const saveSettingsBtn = document.getElementById("save-settings-btn");


const siteForm = document.getElementById("site-form");

const siteInput = document.getElementById("site-input");

const addSiteBtn = document.getElementById("add-site-btn");

const siteSearchInput = document.getElementById("site-search-input");

const sitesListContainer = document.getElementById("sites-list");


const exportJsonBtn = document.getElementById("export-json-btn");

const importJsonBtn = document.getElementById("import-json-btn");

const importJsonInput = document.getElementById("import-json-input");


/* Initialize Dashboard */

document.addEventListener("DOMContentLoaded", () => {

    initializeAuth();

    initializeEventListeners();

});


/* Initialize Auth Listener */

function initializeAuth() {

    onAuthStateChanged(auth, async (user) => {

        if (!user) {

            window.location.href = ROUTES.LOGIN;

            return;

        }

        currentUser = user;

        updateUsername(user.displayName || user.email.split("@")[0]);

        

        setupRealtimeListeners();

    });

}


/* Setup Realtime Firebase Listeners */

function setupRealtimeListeners() {

    if (!currentUser) return;


    // 1. Settings Listener

    const settingsRef = ref(database, `${FIREBASE_PATHS.SETTINGS}/${currentUser.uid}`);

    onValue(settingsRef, (snapshot) => {

        if (snapshot.exists()) {

            currentSettings = snapshot.val();

            if (blockingToggle) blockingToggle.checked = currentSettings.enabled || false;

            if (startTimeInput) startTimeInput.value = currentSettings.startTime || "09:00";

            if (endTimeInput) endTimeInput.value = currentSettings.endTime || "17:00";

            updateBlockingStatus(currentSettings.enabled);

        }

        updateSessionTimer();

    });


    // 2. Blocked Sites Listener

    const sitesRef = ref(database, `${FIREBASE_PATHS.BLOCKED_SITES}/${currentUser.uid}`);

    onValue(sitesRef, (snapshot) => {

        if (snapshot.exists()) {

            currentBlockedWebsites = Object.values(snapshot.val());

        } else {

            currentBlockedWebsites = [];

        }

        refreshSitesList();

    });


    // 3. Blocked Attempts Listener

    const attemptsRef = ref(database, `${FIREBASE_PATHS.BLOCKED_ATTEMPTS}/${currentUser.uid}`);

    onValue(attemptsRef, (snapshot) => {

        if (snapshot.exists()) {

            const val = snapshot.val();

            currentAttemptsList = Object.values(val);

            

            // Compute hit counts map

            currentHitCountsMap = {};

            currentAttemptsList.forEach(attempt => {

                if (attempt.domain) {

                    currentHitCountsMap[attempt.domain] = (currentHitCountsMap[attempt.domain] || 0) + 1;

                }

            });

        } else {

            currentAttemptsList = [];

            currentHitCountsMap = {};

        }

        

        refreshSitesList();

        updateMetrics(currentAttemptsList, currentSettings);

    });

}


/* Refresh Blocked Sites List */

function refreshSitesList() {

    renderBlockedSites(currentBlockedWebsites, currentHitCountsMap, searchFilterQuery);

}


/* Event Listeners */

function initializeEventListeners() {

    if (logoutButton) {

        logoutButton.addEventListener("click", handleLogout);

    }


    if (settingsForm) {

        settingsForm.addEventListener("submit", handleSaveSettings);

    }


    if (siteForm) {

        siteForm.addEventListener("submit", handleAddSite);

    }


    if (sitesListContainer) {

        sitesListContainer.addEventListener("click", handleRemoveSite);

    }


    if (siteSearchInput) {

        siteSearchInput.addEventListener("input", (e) => {

            searchFilterQuery = e.target.value;

            refreshSitesList();

        });

    }


    if (exportJsonBtn) {

        exportJsonBtn.addEventListener("click", handleExportJson);

    }


    if (importJsonBtn && importJsonInput) {

        importJsonBtn.addEventListener("click", () => importJsonInput.click());

        importJsonInput.addEventListener("change", handleImportJson);

    }


    // Start periodic timer tick for current session countdown

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(updateSessionTimer, 1000);

}


/* Handle Logout */

async function handleLogout() {

    try {

        await signOut(auth);

        window.location.href = ROUTES.LOGIN;

    } catch (err) {

        showMessage("Logout failed. Please try again.", MESSAGE_TYPES.ERROR);

    }

}


/* Handle Save Settings */

async function handleSaveSettings(e) {

    e.preventDefault();

    if (!currentUser) return;


    disableButton(saveSettingsBtn);

    const enabled = blockingToggle ? blockingToggle.checked : false;

    const startTime = startTimeInput ? startTimeInput.value : "09:00";

    const endTime = endTimeInput ? endTimeInput.value : "17:00";


    const updatedSettings = { enabled, startTime, endTime };


    try {

        await set(ref(database, `${FIREBASE_PATHS.SETTINGS}/${currentUser.uid}`), updatedSettings);

        updateBlockingStatus(enabled);

        showMessage("Settings saved successfully.", MESSAGE_TYPES.SUCCESS);

    } catch (err) {

        showMessage("Failed to save settings.", MESSAGE_TYPES.ERROR);

    } finally {

        enableButton(saveSettingsBtn);

    }

}


/* Handle Add Site */

async function handleAddSite(e) {

    e.preventDefault();

    if (!currentUser || !siteInput) return;


    const rawDomain = siteInput.value.trim().toLowerCase();

    if (!rawDomain) return;


    // Clean domain format

    let domain = rawDomain.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];


    if (currentBlockedWebsites.includes(domain)) {

        showMessage(`${domain} is already in your blocked list.`, MESSAGE_TYPES.INFO);

        return;

    }


    disableButton(addSiteBtn);

    const updatedList = [...currentBlockedWebsites, domain];


    try {

        await set(ref(database, `${FIREBASE_PATHS.BLOCKED_SITES}/${currentUser.uid}`), updatedList);

        clearForm();

        showMessage(`${domain} added to blocked list.`, MESSAGE_TYPES.SUCCESS);

    } catch (err) {

        showMessage("Failed to add website.", MESSAGE_TYPES.ERROR);

    } finally {

        enableButton(addSiteBtn);

    }

}


/* Handle Remove Site */

async function handleRemoveSite(e) {

    const removeBtn = e.target.closest(".remove-site-btn");

    if (!removeBtn || !currentUser) return;


    const domainToRemove = removeBtn.dataset.website;

    if (!domainToRemove) return;


    const updatedList = currentBlockedWebsites.filter(site => site !== domainToRemove);


    try {

        await set(ref(database, `${FIREBASE_PATHS.BLOCKED_SITES}/${currentUser.uid}`), updatedList);

        showMessage(`${domainToRemove} removed from blocked list.`, MESSAGE_TYPES.SUCCESS);

    } catch (err) {

        showMessage("Failed to remove website.", MESSAGE_TYPES.ERROR);

    }

}


/* Handle Export JSON */

function handleExportJson() {

    if (currentBlockedWebsites.length === 0) {

        showMessage("No blocked websites to export.", MESSAGE_TYPES.INFO);

        return;

    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentBlockedWebsites, null, 2));

    const downloadAnchor = document.createElement("a");

    downloadAnchor.setAttribute("href", dataStr);

    downloadAnchor.setAttribute("download", `focusshield-blocked-sites.json`);

    document.body.appendChild(downloadAnchor);

    downloadAnchor.click();

    downloadAnchor.remove();

    showMessage("Exported blocked websites to JSON.", MESSAGE_TYPES.SUCCESS);

}


/* Handle Import JSON */

function handleImportJson(e) {

    const file = e.target.files[0];

    if (!file || !currentUser) return;


    const reader = new FileReader();

    reader.onload = async (event) => {

        try {

            const importedSites = JSON.parse(event.target.result);

            if (!Array.isArray(importedSites)) {

                throw new Error("Invalid format");

            }

            const cleanImported = importedSites.map(s => String(s).trim().toLowerCase()).filter(Boolean);

            const merged = Array.from(new Set([...currentBlockedWebsites, ...cleanImported]));


            await set(ref(database, `${FIREBASE_PATHS.BLOCKED_SITES}/${currentUser.uid}`), merged);

            showMessage(`Imported ${cleanImported.length} websites successfully.`, MESSAGE_TYPES.SUCCESS);

        } catch (err) {

            showMessage("Failed to import JSON. File must contain an array of domains.", MESSAGE_TYPES.ERROR);

        }

    };

    reader.readAsText(file);

}


/* Session Timer Calculation */

function updateSessionTimer() {

    const timerValEl = document.getElementById("active-session-timer");

    const timerSubtextEl = document.getElementById("active-session-subtext");

    if (!timerValEl) return;


    if (!currentSettings || !currentSettings.enabled) {

        timerValEl.textContent = "Inactive";

        if (timerSubtextEl) timerSubtextEl.textContent = "Blocking disabled in settings";

        return;

    }


    const now = new Date();

    const currentMinutes = now.getHours() * 60 + now.getMinutes();


    const [startH, startM] = (currentSettings.startTime || "09:00").split(":").map(Number);

    const [endH, endM] = (currentSettings.endTime || "17:00").split(":").map(Number);


    const startTotal = startH * 60 + startM;

    const endTotal = endH * 60 + endM;


    let isActive = false;

    let remainingMinutes = 0;


    if (startTotal < endTotal) {

        isActive = currentMinutes >= startTotal && currentMinutes < endTotal;

        remainingMinutes = endTotal - currentMinutes;

    } else {

        isActive = currentMinutes >= startTotal || currentMinutes < endTotal;

        remainingMinutes = currentMinutes >= startTotal ? (1440 - currentMinutes + endTotal) : (endTotal - currentMinutes);

    }


    if (isActive) {

        const hoursLeft = Math.floor(remainingMinutes / 60);

        const minsLeft = remainingMinutes % 60;

        const secsLeft = 59 - now.getSeconds();


        const pad = (n) => String(n).padStart(2, "0");

        timerValEl.textContent = `${pad(hoursLeft)}:${pad(minsLeft)}:${pad(secsLeft)}`;

        if (timerSubtextEl) timerSubtextEl.textContent = `Session ends at ${currentSettings.endTime}`;

    } else {

        timerValEl.textContent = "Inactive";

        if (timerSubtextEl) timerSubtextEl.textContent = `Next session starts at ${currentSettings.startTime}`;

    }

}
