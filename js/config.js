"use strict";

/* Application */

export const APP_NAME = "FocusShield";

export const APP_VERSION = "1.0.0";

/* Default settings */

export const DEFAULT_BLOCKING_ENABLED = true;

export const DEFAULT_START_TIME = "08:00";

export const DEFAULT_END_TIME = "17:00";

/* Supported social media */

export const SUPPORTED_SOCIAL_MEDIA = [

    "facebook.com",

    "www.facebook.com",

    "instagram.com",

    "www.instagram.com",

    "tiktok.com",

    "www.tiktok.com",

    "x.com",

    "www.x.com",

    "twitter.com",

    "www.twitter.com",

    "youtube.com",

    "www.youtube.com",

    "snapchat.com",

    "www.snapchat.com",

    "reddit.com",

    "www.reddit.com",

    "linkedin.com",

    "www.linkedin.com",

    "threads.net",

    "www.threads.net"

];

/* Firebase paths */

export const FIREBASE_PATHS = {

    USERS: "users",

    BLOCKED_SITES: "blockedSites",

    SETTINGS: "settings",

    BLOCKED_ATTEMPTS: "blockedAttempts"

};

/* Local storage keys */

export const LOCAL_STORAGE_KEYS = {

    USER_SESSION: "focusshieldUser",

    DRAFT_SETTINGS: "focusshieldDraft",

    EXTENSION_VERSION: "focusshieldExtensionVersion"

};

/* Routes */

export const ROUTES = {

    HOME: "index.html",

    ABOUT: "about.html",

    LOGIN: "login.html",

    SIGNUP: "signup.html",

    DASHBOARD: "dashboard.html"

};

/* Message types */

export const MESSAGE_TYPES = {

    SUCCESS: "success",

    ERROR: "error",

    INFO: "info"

};