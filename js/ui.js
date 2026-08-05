"use strict";


/* Dynamic Element Getters */

const getMessageElement = () => document.getElementById("status-message") || document.getElementById("message");

const getLoadingElement = () => document.getElementById("loading-overlay");

const getUsernameElement = () => document.getElementById("username-display") || document.getElementById("username");

const getBlockingStatusElement = () => document.getElementById("blocking-status");

const getBlockedSitesContainer = () => document.getElementById("sites-list") || document.getElementById("blocked-sites-list");

const getEmptyStateElement = () => document.getElementById("empty-state");


/* Show message */

export function showMessage(message, type) {

    const messageElement = getMessageElement();

    if (!messageElement) {

        return;

    }

    messageElement.textContent = message;

    messageElement.className = `message ${type}`;

    messageElement.hidden = false;

}


/* Hide message */

export function hideMessage() {

    const messageElement = getMessageElement();

    if (!messageElement) {

        return;

    }

    messageElement.hidden = true;

    messageElement.textContent = "";

}


/* Show loader */

export function showLoader() {

    const loadingElement = getLoadingElement();

    if (!loadingElement) {

        return;

    }

    loadingElement.hidden = false;

}


/* Hide loader */

export function hideLoader() {

    const loadingElement = getLoadingElement();

    if (!loadingElement) {

        return;

    }

    loadingElement.hidden = true;

}


/* Update username */

export function updateUsername(username) {

    const usernameElement = getUsernameElement();

    if (!usernameElement) {

        return;

    }

    usernameElement.textContent = username;

}


/* Update blocking status */

export function updateBlockingStatus(enabled) {

    const blockingStatusElement = getBlockingStatusElement();

    if (!blockingStatusElement) {

        return;

    }

    blockingStatusElement.textContent = enabled ? "Enabled" : "Disabled";

    blockingStatusElement.className = enabled ? "status enabled" : "status disabled";

}


/* Render blocked websites with hit counts */

export function renderBlockedSites(websites, hitCountsMap = {}, filterQuery = "") {

    const blockedSitesContainer = getBlockedSitesContainer();

    if (!blockedSitesContainer) {

        return;

    }

    blockedSitesContainer.innerHTML = "";


    const sites = Array.isArray(websites) ? websites : Object.values(websites || {});

    const query = (filterQuery || "").toLowerCase().trim();


    const filteredSites = sites.filter(site => site.toLowerCase().includes(query));


    if (filteredSites.length === 0) {

        showEmptyState();

        return;

    }


    hideEmptyState();


    filteredSites.forEach((website) => {

        const hits = hitCountsMap[website] || 0;

        blockedSitesContainer.appendChild(createSiteCard(website, hits));

    });

}


/* Create site card element */

export function createSiteCard(website, hitCount = 0) {

    const card = document.createElement("div");

    card.className = "site-card";


    const siteInfo = document.createElement("div");

    siteInfo.className = "site-info";


    const domainSpan = document.createElement("span");

    domainSpan.className = "site-domain";

    domainSpan.textContent = website;


    siteInfo.appendChild(domainSpan);


    if (hitCount > 0) {

        const hitPill = document.createElement("span");

        hitPill.className = "hit-count-pill";

        hitPill.textContent = `${hitCount} blocked`;

        siteInfo.appendChild(hitPill);

    }


    const removeButton = document.createElement("button");

    removeButton.type = "button";

    removeButton.className = "button button-secondary remove-site-btn";

    removeButton.style.height = "36px";

    removeButton.style.padding = "0 14px";

    removeButton.style.fontSize = "13px";

    removeButton.dataset.website = website;

    removeButton.innerHTML = `<i class="fa-solid fa-trash"></i> Remove`;


    card.append(siteInfo, removeButton);

    return card;

}


/* Update Realtime Metrics & Charts */

export function updateMetrics(attempts = [], settings = {}) {

    const attemptsList = Array.isArray(attempts) ? attempts : Object.values(attempts || {});

    const totalAttempts = attemptsList.length;


    // 1. Blocked Attempts Today

    const todayStart = new Date();

    todayStart.setHours(0, 0, 0, 0);

    const todayAttempts = attemptsList.filter(a => a.timestamp >= todayStart.getTime()).length;


    const attemptsEl = document.getElementById("blocked-attempts-count");

    if (attemptsEl) {

        attemptsEl.textContent = todayAttempts;

    }


    // 2. Hours Saved

    const hoursSaved = (attemptsList.length * (10 / 60)).toFixed(1);

    const hoursEl = document.getElementById("hours-saved-count");

    if (hoursEl) {

        hoursEl.textContent = `${hoursSaved} hrs`;

    }


    // 3. Focus Score Dynamic Calculation

    const scoreValueEl = document.getElementById("focus-score-value");

    const scoreTitleEl = document.getElementById("focus-score-title");

    const scoreSubtextEl = document.getElementById("focus-score-subtext");

    const progressCircle = document.getElementById("gauge-progress-circle");


    if (scoreValueEl) {

        if (attemptsList.length === 0) {

            scoreValueEl.textContent = "--";

            if (scoreTitleEl) scoreTitleEl.textContent = "No Data";

            if (scoreSubtextEl) scoreSubtextEl.textContent = "Complete sessions to generate score";

            if (progressCircle) progressCircle.style.strokeDashoffset = "251";

        } else {

            const calculatedScore = Math.min(99, 70 + Math.min(28, attemptsList.length * 2));

            scoreValueEl.textContent = `${calculatedScore}%`;

            if (scoreTitleEl) scoreTitleEl.textContent = calculatedScore >= 85 ? "Optimal Focus" : "Good Progress";

            if (scoreSubtextEl) scoreSubtextEl.textContent = `+${Math.min(20, attemptsList.length)}% vs last week`;

            if (progressCircle) {

                const offset = 251 - (251 * (calculatedScore / 100));

                progressCircle.style.strokeDashoffset = String(offset);

            }

        }

    }


    // 4. Weekly Bar Chart Data

    renderWeeklyChart(attemptsList);


    // 5. Streak Grid

    renderStreakGrid(attemptsList);

}


/* Render Weekly Productivity Bar Chart */

function renderWeeklyChart(attemptsList) {

    const container = document.getElementById("chart-bars-container");

    if (!container) return;


    const daysMap = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun counts

    const now = new Date();

    const currentDay = now.getDay(); // 0 is Sun, 1 is Mon


    attemptsList.forEach(item => {

        if (!item.timestamp) return;

        const date = new Date(item.timestamp);

        let dayIdx = date.getDay() - 1; // 0 for Mon, 6 for Sun

        if (dayIdx < 0) dayIdx = 6;

        daysMap[dayIdx] += 1;

    });


    const maxVal = Math.max(...daysMap, 1);

    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


    container.innerHTML = "";

    daysMap.forEach((count, idx) => {

        const heightPct = Math.round((count / maxVal) * 100);

        const col = document.createElement("div");

        col.className = "bar-col";

        col.innerHTML = `

            <div class="bar-fill" style="height: ${heightPct}%;" title="${count} attempts"></div>

            <span class="bar-label">${labels[idx]}</span>

        `;

        container.appendChild(col);

    });

}


/* Render 30-Day Streak Grid */

function renderStreakGrid(attemptsList) {

    const grid = document.getElementById("streak-grid");

    const streakSubtext = document.getElementById("streak-subtext");

    if (!grid) return;


    const activeDaysSet = new Set();

    attemptsList.forEach(item => {

        if (item.timestamp) {

            const d = new Date(item.timestamp);

            activeDaysSet.add(d.getDate());

        }

    });


    grid.innerHTML = "";

    let activeCount = 0;

    for (let day = 1; day <= 28; day++) {

        const isActive = activeDaysSet.has(day);

        if (isActive) activeCount++;

        const dayEl = document.createElement("div");

        dayEl.className = `streak-day ${isActive ? "active" : ""}`;

        dayEl.textContent = day;

        grid.appendChild(dayEl);

    }


    if (streakSubtext) {

        streakSubtext.textContent = activeCount > 0 

            ? `${activeCount} days of focus logged this month.`

            : "Complete focus sessions to build your streak.";

    }

}


/* Clear form */

export function clearForm() {

    const form = document.getElementById("site-form");

    if (form) form.reset();

}


/* Disable button */

export function disableButton(button) {

    if (button) button.disabled = true;

}


/* Enable button */

export function enableButton(button) {

    if (button) button.disabled = false;

}


/* Show empty state */

export function showEmptyState() {

    const emptyStateElement = getEmptyStateElement();

    if (emptyStateElement) emptyStateElement.hidden = false;

}


/* Hide empty state */

export function hideEmptyState() {

    const emptyStateElement = getEmptyStateElement();

    if (emptyStateElement) emptyStateElement.hidden = true;

}


/* Initialize FAQ Accordion */

export function initializeFaq() {

    const questions = document.querySelectorAll(".faq-question");

    questions.forEach((q) => {

        q.addEventListener("click", () => {

            const item = q.parentElement;

            const isOpen = item.classList.contains("active");

            document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("active"));

            if (!isOpen) item.classList.add("active");

        });

    });

}


/* Initialize Showcase Tabs */

export function initializeShowcaseTabs() {

    const tabs = document.querySelectorAll(".showcase-tab");

    if (!tabs || tabs.length === 0) return;


    tabs.forEach((tab) => {

        tab.addEventListener("click", () => {

            const targetId = tab.dataset.target;

            if (!targetId) return;


            document.querySelectorAll(".showcase-tab").forEach(t => t.classList.remove("active"));

            document.querySelectorAll(".showcase-panel").forEach(p => p.classList.remove("active"));


            tab.classList.add("active");

            const targetPanel = document.getElementById(`showcase-${targetId}`);

            if (targetPanel) {

                targetPanel.classList.add("active");

            }

        });

    });

}


/* Initialize Video Tutorial Simulator */

export function initializeVideoTutorial() {

    const playBtn = document.getElementById("video-play-btn");

    const stepBtns = document.querySelectorAll(".step-nav-btn");

    const progressBar = document.getElementById("video-progress-bar");

    const timeDisplay = document.getElementById("video-time-display");

    const titleDisplay = document.getElementById("video-scene-title");


    if (!playBtn || stepBtns.length === 0) return;


    const sceneTitles = {

        "1": "Step 1: Download & Extract FocusShield Package",

        "2": "Step 2: Load Unpacked Extension in Chrome Developer Mode",

        "3": "Step 3: Open Extension Popup & Sign In",

        "4": "Step 4: Real-time Website Interception Active"

    };


    let currentScene = 1;

    let isPlaying = true;

    let timer = null;


    function setScene(num) {

        currentScene = num;

        document.querySelectorAll(".video-scene").forEach(s => s.classList.remove("active"));

        stepBtns.forEach(b => b.classList.remove("active"));


        const targetScene = document.getElementById(`scene-${num}`);

        if (targetScene) targetScene.classList.add("active");


        const activeBtn = document.querySelector(`.step-nav-btn[data-scene="${num}"]`);

        if (activeBtn) activeBtn.classList.add("active");


        if (titleDisplay && sceneTitles[String(num)]) {

            titleDisplay.textContent = sceneTitles[String(num)];

        }


        if (progressBar) {

            progressBar.style.width = `${(num / 4) * 100}%`;

        }


        if (timeDisplay) {

            const seconds = num * 20;

            timeDisplay.textContent = `00:${seconds < 10 ? "0" + seconds : seconds} / 01:20`;

        }

    }


    function nextScene() {

        let next = currentScene + 1;

        if (next > 4) next = 1;

        setScene(next);

    }


    function startAutoPlay() {

        stopAutoPlay();

        isPlaying = true;

        if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';

        timer = setInterval(nextScene, 4000);

    }


    function stopAutoPlay() {

        isPlaying = false;

        if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';

        if (timer) clearInterval(timer);

    }


    playBtn.addEventListener("click", () => {

        if (isPlaying) {

            stopAutoPlay();

        } else {

            startAutoPlay();

        }

    });


    stepBtns.forEach(btn => {

        btn.addEventListener("click", () => {

            const sceneNum = parseInt(btn.dataset.scene, 10);

            if (sceneNum) {

                setScene(sceneNum);

                stopAutoPlay();

            }

        });

    });


    startAutoPlay();

}


if (typeof document !== "undefined") {

    if (document.readyState === "loading") {

        document.addEventListener("DOMContentLoaded", () => {

            initializeFaq();

            initializeShowcaseTabs();

            initializeVideoTutorial();

        });

    } else {

        initializeFaq();

        initializeShowcaseTabs();

        initializeVideoTutorial();

    }

}


