"use strict";

import { SUPPORTED_SOCIAL_MEDIA } from "./config.js";

/* Format time */

export function formatTime(time) {

    if (!time) {

        return "";

    }

    return convertTo12Hour(time);

}

/* Convert 24-hour time to 12-hour time */

export function convertTo12Hour(time) {

    const [hours, minutes] = time.split(":");

    let hour = Number(hours);

    const period = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;

    hour = hour === 0 ? 12 : hour;

    return `${hour}:${minutes} ${period}`;

}

/* Get current time */

export function getCurrentTime() {

    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");

    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;

}

/* Check if current time is inside schedule */

export function isTimeWithinRange(currentTime, startTime, endTime) {

    return currentTime >= startTime && currentTime <= endTime;

}

/* Normalize website */

export function normalizeWebsite(website) {

    return website

        .trim()

        .toLowerCase()

        .replace(/^https?:\/\//, "")

        .replace(/^www\./, "")

        .replace(/\/$/, "");

}

/* Extract domain */

export function extractDomain(url) {

    try {

        return new URL(url).hostname.replace(/^www\./, "");

    }

    catch {

        return normalizeWebsite(url);

    }

}

/* Check supported social media */

export function isSupportedSocialMedia(website) {

    const domain = normalizeWebsite(website);

    return SUPPORTED_SOCIAL_MEDIA.some((site) => {

        const supported = normalizeWebsite(site);

        return domain === supported || domain.endsWith(`.${supported}`);

    });

}

/* Capitalize text */

export function capitalize(text) {

    if (!text) {

        return "";

    }

    return text.charAt(0).toUpperCase() + text.slice(1);

}

/* Generate unique ID */

export function generateUniqueId() {

    return crypto.randomUUID();

}

/* Validate email */

export function validateEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}

/* Validate password */

export function validatePassword(password) {

    return password.length >= 6;

}

/* Validate username */

export function validateUsername(username) {

    return username.trim().length >= 3;

}

/* Validate website */

export function validateWebsiteURL(website) {

    const domain = normalizeWebsite(website);

    return domain.includes(".");

}

/* Current year */

export function getCurrentYear() {

    return new Date().getFullYear();

}