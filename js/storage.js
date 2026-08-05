"use strict";

import { LOCAL_STORAGE_KEYS } from "./config.js";

/* Save user session */

export function saveUserSession(user) {

    localStorage.setItem(

        LOCAL_STORAGE_KEYS.USER_SESSION,

        JSON.stringify(user)

    );

}

/* Get user session */

export function getUserSession() {

    const session = localStorage.getItem(

        LOCAL_STORAGE_KEYS.USER_SESSION

    );

    return session ? JSON.parse(session) : null;

}

/* Remove user session */

export function removeUserSession() {

    localStorage.removeItem(

        LOCAL_STORAGE_KEYS.USER_SESSION

    );

}

/* Save draft settings */

export function saveDraftSettings(settings) {

    localStorage.setItem(

        LOCAL_STORAGE_KEYS.DRAFT_SETTINGS,

        JSON.stringify(settings)

    );

}

/* Get draft settings */

export function getDraftSettings() {

    const draft = localStorage.getItem(

        LOCAL_STORAGE_KEYS.DRAFT_SETTINGS

    );

    return draft ? JSON.parse(draft) : null;

}

/* Clear draft settings */

export function clearDraftSettings() {

    localStorage.removeItem(

        LOCAL_STORAGE_KEYS.DRAFT_SETTINGS

    );

}

/* Save extension version */

export function saveExtensionVersion(version) {

    localStorage.setItem(

        LOCAL_STORAGE_KEYS.EXTENSION_VERSION,

        version

    );

}

/* Get extension version */

export function getExtensionVersion() {

    return localStorage.getItem(

        LOCAL_STORAGE_KEYS.EXTENSION_VERSION

    );

}

/* Clear all FocusShield data */

export function clearApplicationStorage() {

    removeUserSession();

    clearDraftSettings();

    localStorage.removeItem(

        LOCAL_STORAGE_KEYS.EXTENSION_VERSION

    );

}