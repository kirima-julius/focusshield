# <i class="fa-solid fa-shield-halved"></i> FocusShield

> **Block Distractions. Stay Focused. Elevate Productivity.**

FocusShield is a full-stack, zero-mock distraction management platform paired with a Manifest V3 Chrome Extension. It empowers users to define scheduled focus windows and block distracting social media websites dynamically synced via Firebase Realtime Database.

**Author:** Julius Kirima  
**Version:** 1.0.0  
**License:** MIT  

---

## <i class="fa-solid fa-star"></i> Key Features

- <i class="fa-solid fa-key"></i> **Realtime Firebase Authentication:** Secure account creation and login synced seamlessly across devices.
- <i class="fa-solid fa-rotate"></i> **Realtime Settings Synchronization:** Blocked website lists and focus schedules are stored in Firebase Realtime Database and synced live to the Chrome extension.
- <i class="fa-solid fa-clock"></i> **Scheduled Focus Hours:** Set custom start and end times for blocking rules to automatically take effect.
- <i class="fa-solid fa-ban"></i> **Automated Browser Enforcement:** Chrome Extension Manifest V3 background service worker monitors navigation and redirects blocked domain visits to a custom FocusShield blocking screen.
- <i class="fa-solid fa-palette"></i> **Premium Dark Glassmorphic UI:** Styled with a modern dark slate palette, smooth gradients, glowing glassmorphic cards, and 100vh viewport section layouts.
- <i class="fa-solid fa-box-archive"></i> **Ready-to-Deploy ZIP Packaging:** Direct in-app extension downloader for fast local developer and user deployment.

---

## <i class="fa-solid fa-images"></i> Application Showcase & Screenshots

### 1. Real-time Chrome Extension Interception
![FocusShield Chrome Extension Interception Screen](screenshots/blocked_popup_screenshot.png)

### 2. Web Analytics & Focus Score Overview
![FocusShield Web Dashboard Analytics Overview](screenshots/dashboard_top_screenshot.png)

### 3. Schedule Settings & Blocked Website Management
![FocusShield Schedule Settings & Blocked List Controls](screenshots/dashboard_settings_screenshot.png)

---

## <i class="fa-solid fa-folder-tree"></i> Repository Architecture

```text
FOCUSSHIELD/
├── index.html              # Marketing Homepage with 100vh sections & process list
├── about.html              # Platform architecture, mission & technology stack
├── dashboard.html          # User dashboard for setting schedule & blocked websites
├── login.html              # Firebase authentication login page
├── signup.html             # User registration page
├── README.md               # Project documentation
├── assets/                 # Web application brand assets
│   └── icons/
│       ├── logo.png        # Brand logo (256x256)
│       └── favicon.png     # Website favicon (32x32)
├── css/                    # Modular Vanilla CSS Stylesheets
│   ├── main.css            # Global CSS tokens, dark theme, buttons, 100vh sections & process ULs
│   ├── dashboard.css       # Dashboard card grid and site card layouts
│   ├── auth.css            # Centered login/signup form styles
│   ├── about.css           # About page section layouts
│   └── responsive.css     # Mobile and desktop breakpoint rules
├── downloads/              # Deployable extension release packages
│   └── FocusShield-Extension.zip # Pre-packaged Chrome extension release
├── extension/              # Chrome Extension (Manifest V3) Source
│   ├── manifest.json       # Chrome Manifest V3 manifest declaration
│   ├── background.js       # Background service worker for tab monitoring & blocking
│   ├── popup.html          # Extension popup interface
│   ├── popup.js            # Extension popup authentication & live status logic
│   ├── blocked.html        # Custom blocked site landing page
│   ├── blocked.js          # Blocked page schedule reader
│   ├── config.js           # Shared Firebase and API endpoints configuration
│   ├── firebase.js         # Modular Firebase Auth & Database initialization
│   ├── extension.css       # Extension popup and blocked page stylesheet
│   └── icons/              # Extension icons (16x16, 32x32, 48x48, 128x128)
└── js/                     # Web Application JavaScript ES Modules
    ├── auth.js             # User login, registration, and logout handling
    ├── dashboard.js        # Dynamic settings retrieval, site management, & Firebase listeners
    ├── ui.js               # Dynamic DOM element getters, notification popups, & fallbacks
    ├── download.js         # Extension ZIP download trigger logic
    └── config.js           # Firebase app credentials and database paths
```

---

## <i class="fa-solid fa-rocket"></i> Quick Start & Installation

### 1. Running the Web Application Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/kirima-julius/focusshield.git
   cd focusshield
   ```

2. Serve the directory using any static web server option below:

   **NPM / Node.js Server Options (Recommended):**
   ```bash
   # Option 1: Using npx serve
   npx serve .

   # Option 2: Using npx http-server
   npx http-server -p 8000

   # Option 3: Using npx live-server
   npx live-server
   ```

   **VS Code Extension Option:**
   - Open the project in VS Code, right-click `index.html`, and select **Open with Live Server**.

   **Python HTTP Server Option:**
   ```bash
   python3 -m http.server 8000
   ```
   *(Note: We haven't looked at Python yet in class, but Python's built-in HTTP module works as a quick static web server if installed on your computer).*

3. Open `http://localhost:8000` (or the port shown by your server) in your web browser.

---

### 2. Installing the Chrome Extension

#### Method A: Direct Download via Web App
1. Navigate to the FocusShield homepage (`index.html`).
2. Click **Download Extension** to download `FocusShield-Extension.zip`.
3. Extract the downloaded `.zip` file into a folder on your computer.

#### Method B: Developer Mode Load
1. Open Google Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode** in the top-right corner toggle.
3. Click **Load unpacked** and select the `extension/` directory (or your extracted folder).
4. Click the FocusShield extension icon in your Chrome toolbar to log in and sync your settings!

---

## <i class="fa-solid fa-layer-group"></i> Technology Stack

- <i class="fa-brands fa-html5"></i> **HTML5:** Semantic structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`), valid page hierarchy, and user input forms.
- <i class="fa-brands fa-css3-alt"></i> **CSS3:** Custom page styling, layout with Flexbox and CSS Grid, and responsive design for mobile, tablet, and desktop devices *(Note: advanced CSS frameworks were not looked at yet in class)*.
- <i class="fa-brands fa-js"></i> **JavaScript (JS):** DOM manipulation, event listeners, form validation, dynamic data rendering, and script modules.
- <i class="fa-solid fa-database"></i> **Local Storage (`localStorage`):** Client-side data storage and retrieval between pages *(Note: we haven't looked at complex database servers yet in class, so localStorage is used for client data persistence)*.
- <i class="fa-solid fa-fire"></i> **Firebase:** User authentication (Email/Password) and Realtime Database for account login and live settings sync *(Note: custom backend server stacks were not looked at yet in class)*.
- <i class="fa-brands fa-chrome"></i> **Chrome Extension API:** Manifest V3 background service worker for automated browser website enforcement.

---

## <i class="fa-solid fa-compass"></i> Future Features

The following features are planned for future releases of FocusShield:

| <i class="fa-solid fa-lock"></i> Authentication & Security | <i class="fa-solid fa-calendar-days"></i> Advanced Scheduling | <i class="fa-solid fa-globe"></i> Website Blocking |
| :--- | :--- | :--- |
| • Google Sign-In<br>• Microsoft Sign-In<br>• Two-Factor Auth (2FA)<br>• Password Reset via Email<br>• Device Session Management | • Multiple Focus Schedules<br>• Weekday vs Weekend Rules<br>• One-click Focus Mode<br>• Pomodoro Timer Sync<br>• Calendar Synchronization | • Custom Blacklist & Whitelist<br>• Category-based Blocking<br>• Wildcard Domain Support<br>• Keyword/URL Interception<br>• Admin Approval Override |

| <i class="fa-solid fa-chart-column"></i> Analytics & Insights | <i class="fa-solid fa-robot"></i> Smart Features | <i class="fa-solid fa-bell"></i> Notifications |
| :--- | :--- | :--- |
| • Daily & Weekly Reports<br>• Time Saved Analytics<br>• Most Visited Blocked Sites<br>• Focus Score Trends<br>• Exportable PDF & CSV Reports | • AI Productivity Tips<br>• Habit-based Suggestions<br>• Smart Break Reminders<br>• Habit Tracking<br>• Productivity Achievements | • Desktop Push Alerts<br>• Focus Session Reminders<br>• Daily Progress Summaries<br>• Weekly Goal Alerts<br>• Milestone Badges |

| <i class="fa-solid fa-cloud"></i> Cloud & Synchronization | <i class="fa-solid fa-users"></i> Team & Organization | <i class="fa-solid fa-mobile-screen"></i> Mobile & Integrations |
| :--- | :--- | :--- |
| • Cross-Device Sync<br>• Automated Cloud Backup<br>• Multi-Browser Support<br>• Offline Mode with Auto-Sync | • Family Account Sharing<br>• Team Admin Dashboard<br>• Workplace Portal<br>• Shared Focus Schedules | • Android & iOS Companion<br>• Push Notifications<br>• Slack & Discord Sync<br>• Notion, Todoist & Trello Sync |

| <i class="fa-solid fa-gamepad"></i> Gamification & Customization | <i class="fa-solid fa-shield-cat"></i> Enterprise & Performance |
| :--- | :--- |
| • Daily Challenges & Level Ups<br>• Productivity Leaderboards<br>• Custom Light/Dark Themes<br>• Custom Notification Sounds | • Organization Policy Management<br>• Role-based Access & Audit Logs<br>• Optimized Fast Detection Engine<br>• Lower Memory & CPU Footprint |

---

## <i class="fa-solid fa-user-pen"></i> Author & Credits

Designed, architected, and engineered by **Julius Kirima**.

- **GitHub:** [@kirima-julius](https://github.com/kirima-julius)
- **Project:** FocusShield Platform & Extension

---

© 2026 FocusShield. All rights reserved.
