"use strict";

import {

    APP_NAME

} from "./config.js";

import {

    showMessage

} from "./ui.js";

import {

    MESSAGE_TYPES

} from "./config.js";

/* Extension zip */

const EXTENSION_ZIP = "./downloads/FocusShield-Extension.zip";


/* Guide modal */

const guideModal = document.getElementById("download-guide-modal");


/* Close guide button */

const closeGuideButton = document.getElementById("close-guide-btn");


/* Download extension */

export function downloadExtension(event) {

    showDownloadGuide();

}


/* Show installation guide */

export function showDownloadGuide() {

    if (!guideModal) {

        return;

    }

    guideModal.hidden = false;

}


/* Hide installation guide */

export function hideDownloadGuide() {

    if (!guideModal) {

        return;

    }

    guideModal.hidden = true;

}


/* Check extension availability */

export async function checkDownloadAvailability() {

    if (window.location.protocol.startsWith("http")) {

        try {

            const response = await fetch(EXTENSION_ZIP, { method: "HEAD" });

            if (!response.ok) {

                throw new Error();

            }

        } catch {

            // Silent fail to avoid disrupting user interface

        }

    }

}


/* Initialize download */

export function initializeDownload() {

    const buttons = [

        document.getElementById("download-extension-btn"),

        document.getElementById("hero-download-btn"),

        document.getElementById("download-extension-card-btn")

    ];


    buttons.forEach((btn) => {

        if (btn) {

            btn.addEventListener("click", downloadExtension);

        }

    });


    if (closeGuideButton) {

        closeGuideButton.addEventListener(

            "click",

            hideDownloadGuide

        );

    }

    checkDownloadAvailability();

}