# StudyMate AI — Personal AI Study Assistant & Learning Analytics

> **A modern, responsive, client-side web application engineered to transform raw study notes into structured summaries, multiple-choice quizzes, 3D flashcards, and longitudinal learning analytics using the Google Gemini API (`gemini-3.5-flash-lite`) and browser LocalStorage.**
>
> Built strictly with **HTML5, CSS3, and Vanilla JavaScript (ES6+)** — zero external frameworks, zero npm packages, zero external CDNs, and zero backend services.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Key Features](#2-key-features)
3. [Technology Stack](#3-technology-stack)
4. [Project Architecture & File Structure](#4-project-architecture--file-structure)
5. [LocalStorage Schema & Data Architecture](#5-localstorage-schema--data-architecture)
6. [Quick Start Guide](#6-quick-start-guide)
7. [Google Gemini AI Configuration](#7-google-gemini-ai-configuration)
8. [Comprehensive User Guide](#8-comprehensive-user-guide)
   - [A. Study Input & Generation](#a-study-input--generation)
   - [B. Study Summary Workspace](#b-study-summary-workspace)
   - [C. Interactive 5-Question Quiz Engine](#c-interactive-5-question-quiz-engine)
   - [D. 3D Spaced-Repetition Flashcards](#d-3d-spaced-repetition-flashcards)
   - [E. Persistent Study History](#e-persistent-study-history)
   - [F. Learning Analytics & Progress Dashboard](#f-learning-analytics--progress-dashboard)
   - [G. Data Management (Export, Import & Reset)](#g-data-management-export-import--reset)
9. [Error Handling & Security Architecture](#9-error-handling--security-architecture)
10. [Browser Compatibility](#10-browser-compatibility)

---

## 1. Project Overview

**StudyMate AI** streamlines exam preparation and study routines for students. Transitioning from passive reading to active recall is the most scientifically proven method for long-term retention. StudyMate AI automates this transition: students simply paste their class notes, lecture transcripts, or textbook chapters to instantly receive:

1. **Curated Summaries**: Formatted paragraphs, high-yield takeaways, and concept definitions.
2. **Practice Quizzes**: 5-question multiple-choice quizzes calibrated to a chosen difficulty level, featuring detailed explanations.
3. **Interactive 3D Flashcards**: Spaced-repetition cards with perspective 3D flip animation, shuffle capabilities, and mastery classification.
4. **Persistent History**: Auto-saved study sessions that can be searched, filtered, sorted, reopened, or deleted at any time.
5. **Learning Analytics**: Visualized score trend charts, topic-wise mastery breakdowns, and real-time dashboard statistics.

The application functions entirely client-side, communicating directly with Google's official Gemini API endpoint while storing all user sessions, quiz scores, flashcard mastery states, and preferences in the browser's `localStorage`.

---

## 2. Key Features

- **Live AI Generation via Google Gemini**: Connects directly to Google's official `gemini-3.5-flash-lite` model using native browser `fetch()` and `AbortController`.
- **Curated Demo Mode**: Includes offline, built-in sample datasets (Data Structures, Operating Systems, DBMS, Computer Networks, JavaScript, and General Knowledge) allowing complete testing without an API key.
- **Strict Response Validation**: Robust parsing layer that verifies JSON structure, required keys, non-empty text, question count, and option limits before rendering.
- **Persistent Study History**: Automatically saves generated sessions with topic, original notes, difficulty, summary style, quiz state, and flashcard progress. Supports keyword search, difficulty filtering, and chronological sorting.
- **Full Session Restoration**: Reopen any past session from history with a single click, restoring the exact summary, quiz questions, and flashcard deck into the active workspace.
- **Learning Analytics & Progress Dashboard**:
  - Total study sessions completed and quizzes taken.
  - Overall average quiz score and personal best score.
  - Total flashcards reviewed and overall deck mastery percentage.
  - Dynamic SVG quiz score trend bar chart with score-based color coding.
  - Topic-wise performance table grouping sessions by subject.
  - Chronological recent activity feed.
- **Complete Data Portability**:
  - Export all study sessions, quiz attempts, flashcard progress, and preferences as a clean JSON backup file.
  - Import existing backup files with schema validation and choose between **Merging** or **Replacing** data.
  - API keys are **never** included in export files to protect student credentials.
- **Responsive & Accessible Design**:
  - Theme switching (Light & Dark modes) powered by CSS Custom Properties (Tokens).
  - Clean collapsible navigation drawer for mobile and tablet screens.
  - Native accessible dialogs (`<dialog>`), ARIA tabs, live character counters, and animated toast notifications.

---

## 3. Technology Stack

StudyMate AI is engineered strictly adhering to native web standards without external libraries, packages, or build tools:

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Markup** | **HTML5** | Semantic structure (`<header>`, `<nav>`, `<aside>`, `<main>`, `<section>`, `<dialog>`), W3C ARIA tab/dialog roles, responsive `<meta>` viewport. |
| **Styling** | **CSS3** | CSS Custom Properties (Design Tokens), Flexbox, CSS Grid, 3D perspective transforms (`rotateY`), `@media (prefers-reduced-motion)` support. |
| **Logic** | **Vanilla JavaScript (ES6+)** | Strict mode (`'use strict'`), modular state management (`AppState`), StorageManager CRUD utility, dynamic SVG charting. |
| **AI Integration** | **Google Gemini REST API** | Direct endpoint connection to `gemini-3.5-flash-lite:generateContent` using native `fetch()` and `AbortController`. |
| **Persistence** | **Web Storage API** | Browser `localStorage` for versioned sessions, quiz attempts, flashcard classifications, and settings. |
| **Assets** | **Native Inline SVGs** | Zero external icon CDNs (FontAwesome, Lucide, etc.). All icons are embedded vector elements. |
| **Typography** | **System Font Stack** | High-performance native system typography (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`) eliminating font network requests. |

---

## 4. Project Architecture & File Structure

```text
StudyMateAI/
├── index.html        # Complete semantic HTML5 structure: top navigation, sidebar,
│                     # dashboard, history, progress analytics, settings, about,
│                     # accessible modal dialogs, and toast notification container.
├── style.css         # Comprehensive CSS design system: light/dark color tokens,
│                     # typography, layout grids, 3D flip card animations, SVG chart,
│                     # topic performance tables, and responsive mobile breakpoints.
├── script.js         # Modular Vanilla JavaScript engine: AppState, Gemini API client,
│                     # prompt builder, response validator, quiz engine, 3D flashcards,
│                     # StorageManager CRUD, history renderer, and analytics chart.
└── README.md         # Comprehensive project documentation and developer guide.
```

---

## 5. LocalStorage Schema & Data Architecture

All persistent data is managed through a central `StorageManager` object in `script.js` that wraps read/write operations in safe `try/catch` blocks.

### Storage Keys

| Key | Type | Description |
| :--- | :--- | :--- |
| `studymate_sessions_v1` | `Array<Object>` | Array of up to 50 saved study sessions. |
| `studymate_quiz_attempts_v1` | `Array<Object>` | Array of up to 200 completed quiz attempts. |
| `studymate_flashcard_progress_v1` | `Array<Object>` | Per-session flashcard classification records. |
| `studymate_theme` | `String` | Selected theme preference (`'light'` or `'dark'`). |
| `studymate_preferences` | `Object` | Default difficulty, default summary style, flashcard animation. |
| `studymate_api_key` | `String` | Encrypted/masked client-side Gemini API key. |

### Data Structures

#### 1. Study Session (`studymate_sessions_v1`)
```json
{
  "sessionId": "sess-1730300000000-a1b2c3",
  "topic": "Operating Systems - Memory Management",
  "notes": "Paging is a memory management scheme that eliminates...",
  "difficulty": "Medium",
  "style": "Simple Explanation",
  "isAI": true,
  "model": "gemini-3.5-flash-lite",
  "material": {
    "summaryParagraphs": ["Paragraph 1...", "Paragraph 2...", "Paragraph 3..."],
    "takeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3", "Takeaway 4"],
    "concepts": [
      { "term": "Paging", "definition": "A memory allocation technique..." },
      { "term": "Page Fault", "definition": "An interrupt that occurs when..." }
    ]
  },
  "quiz": [
    {
      "question": "What is the primary purpose of virtual memory?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1,
      "explanation": "Virtual memory allows the OS to..."
    }
  ],
  "flashcards": [
    {
      "id": "card-1",
      "front": "What is thrashing in an OS?",
      "back": "A condition where excessive paging leads to..."
    }
  ],
  "createdAt": "2026-10-30T17:30:00.000Z",
  "quizScore": 80,
  "flashcardProgress": {
    "card-1": "known",
    "card-2": "not-known"
  }
}
```

#### 2. Quiz Attempt (`studymate_quiz_attempts_v1`)
```json
{
  "attemptId": "att-1730300050000-x9y8",
  "sessionId": "sess-1730300000000-a1b2c3",
  "topic": "Operating Systems - Memory Management",
  "score": 4,
  "totalQuestions": 5,
  "percentage": 80,
  "correctAnswers": [0, 1, 2, 4],
  "incorrectAnswers": [3],
  "attemptDate": "2026-10-30T17:35:00.000Z"
}
```

---

## 6. Quick Start Guide

Because StudyMate AI relies purely on native web standards, it requires no Node.js runtime, build steps, or package managers.

### Method 1: VS Code Live Server (Recommended)
1. Open the `StudyMateAI` folder in **Visual Studio Code**.
2. Install the **Live Server** extension by *Ritwick Dey* (if not already installed).
3. Right-click on `index.html` in the file explorer and select **Open with Live Server**.
4. The application opens automatically in your default browser at `http://127.0.0.1:5500/index.html`.

### Method 2: Direct File Execution
1. Open the project folder in your operating system's file manager (Finder or File Explorer).
2. Double-click `index.html` to open it in any modern browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari).

---

## 7. Google Gemini AI Configuration

To generate dynamic study materials from your own custom notes:

### 1. Obtain a Free Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google Account.
3. Click **Get API key** and generate a new key.
4. Copy the resulting key (typically starting with `AIzaSy...`).

### 2. Enter and Test Key in StudyMate AI
1. In the sidebar, click **Settings**.
2. Under **AI Provider Configuration**, paste your API key into the input field.
3. Click **Save API Key**. The key is stored locally in `localStorage` under `studymate_api_key`.
4. Click **Test Connection**. The application dispatches a live test request to verify that the key has access to the official `gemini-3.5-flash-lite` model. A green feedback banner will confirm operational readiness.

### 3. Client-Side Security Notice
- The API key is stored exclusively in your local browser storage. It is never transmitted to any third-party server, tracking endpoint, or remote database.
- It is transmitted strictly between your browser and Google's official API endpoint (`generativelanguage.googleapis.com`).
- On shared or public workstations, click **Remove Key** in Settings when your study session is complete.

---

## 8. Comprehensive User Guide

### A. Study Input & Generation

1. **Topic (Optional)**: Enter a topic name (e.g., `Distributed Systems`, `Organic Chemistry`).
2. **Notes Area**: Paste or type lecture notes, textbook excerpts, or revision points (up to 10,000 characters). A live character counter monitors input length and warns when approaching capacity.
3. **Difficulty Selection**:
   - **Easy**: Focuses on core definitions, foundational recall, and basic terms.
   - **Medium**: Balances conceptual understanding, mechanics, and standard applications.
   - **Hard**: Emphasizes edge cases, architectural trade-offs, and complex scenarios.
4. **Summary Style Selection**:
   - **Simple Explanation**: Everyday analogies and accessible language.
   - **Exam-Focused**: High-yield takeaways, formulas, bullet points, and critical facts.
   - **Detailed Notes**: In-depth academic hierarchy with technical definitions.
5. **Generation Modes**:
   - **Generate with AI**: Sends the notes to Google Gemini (`gemini-3.5-flash-lite`), parses the structured JSON response, saves the session to LocalStorage, and renders the workspace.
   - **Try Demo Mode**: Instantly generates study material using curated local datasets without requiring an API key or internet access.

### B. Study Summary Workspace

- **Executive Paragraphs**: Formatted, readable synthesis of the notes according to the chosen style.
- **Key Takeaways**: High-yield bullet points marked with clear visual indicators.
- **Core Concepts Grid**: Dedicated cards detailing key terms and their precise definitions.
- **Copy Summary**: Copies the full formatted summary to your system clipboard with one click.
- **Download Summary**: Generates and downloads a structured `.txt` document named `[Topic]-summary.txt`.

### C. Interactive 5-Question Quiz Engine

- **Curated 5-Question Sets**: Formatted with 4 options each, matching the selected difficulty level.
- **Bidirectional Navigation**: Navigate freely across questions using "Previous" and "Next" controls or direct-jump progress dots (1–5).
- **Persistent Answer Selection**: Choices remain locked in place as you move through questions.
- **Submission Protection**: If submitted while questions remain unanswered, an accessible dialog warns the user and offers the choice to review or submit.
- **Interactive Results Review**:
  - Score badge displaying percentage and number of correct answers.
  - Detailed breakdown highlighting selected answers (green for correct, red for incorrect), correct answer indicators, and in-depth explanations for every question.
- **Retake Quiz**: Allows a clean re-attempt without resetting or overwriting the original study session.

### D. 3D Spaced-Repetition Flashcards

- **Perspective 3D Flip**: Click anywhere on a card or press `Space` / `Enter` on keyboard focus to trigger a 180° CSS 3D flip transform.
- **Self-Assessment Tracking**:
  - **Mark as Known** (`✓ Known` badge).
  - **Needs Review** (`⚠️ Needs Review` badge).
- **Deck Summary Counter**: Displays live mastery counts: `Card X of N | Known: K | Review: R | Unclassified: U`.
- **Shuffle Deck**: Randomizes deck order using the Fisher-Yates algorithm while preserving existing classification states.

### E. Persistent Study History

Navigate to the **History** section in the sidebar to review all past study sessions:
- **Search**: Search sessions in real-time by topic or notes content.
- **Difficulty Filter**: Filter sessions by difficulty (`All`, `Easy`, `Medium`, `Hard`).
- **Sort**: Order sessions by `Newest First` or `Oldest First`.
- **Session Cards**: Display session title, creation date, badge indicators (`AI Generated` vs `Demo Mode`, difficulty, quiz score, flashcards reviewed).
- **Reopen Session**: Restores the session directly into the active dashboard workspace with summaries, quizzes, and flashcards ready for revision.
- **Delete Session**: Removes an individual session and its associated quiz/flashcard records after confirmation.
- **Clear All History**: Wipes all saved sessions in bulk with a modal confirmation safeguard.

### F. Learning Analytics & Progress Dashboard

Navigate to the **Progress** section in the sidebar for full study analytics:
- **Quick Statistics Cards**:
  - Total Study Sessions Completed.
  - Total Quiz Attempts.
  - Overall Average Quiz Score across all attempts.
  - Personal Best Quiz Score.
  - Total Flashcards Reviewed.
  - Overall Flashcard Mastery Percentage.
- **Quiz Score Trend Chart**:
  - Native inline SVG bar chart illustrating the percentage scores of your recent quiz attempts.
  - Color-coded bars (Green: $\ge 80\%$, Amber: $60\% - 79\%$, Red: $< 60\%$).
  - Clean Y-axis grid lines and hover tooltips showing score details.
- **Topic-Wise Performance Breakdown**: Table aggregating sessions, average quiz score, personal best score, and flashcard mastery by topic.
- **Recent Activity Feed**: Chronological stream of recent study sessions and quiz submissions with timestamps.

### G. Data Management (Export, Import & Reset)

Navigate to **Settings** to access complete data portability tools:
- **Export Study Data**: Downloads a timestamped JSON backup file (`studymate-backup-YYYY-MM-DD.json`) containing all sessions, quiz attempts, flashcard progress, and preferences. *(Your API key is never included in the backup).*
- **Import Study Data**: Uploads an existing backup file. A prompt asks whether you wish to **Merge** with your current data (avoiding duplicates) or **Replace** all existing data.
- **Clear Study History**: Deletes all saved sessions while preserving quiz scores and preferences.
- **Reset Quiz Scores**: Clears all quiz attempt records and resets average/best score counters.
- **Reset Flashcard Progress**: Clears all flashcard classification records.
- **Wipe All Study Data**: Cleans all sessions, quiz attempts, and flashcards in one action (with danger modal confirmation).
- **Reset Preferences to Defaults**: Restores default theme, difficulty, and summary styles without altering study history.

---

## 9. Error Handling & Security Architecture

### API Resilience Matrix

| Error Scenario | HTTP Code / Trigger | User Feedback | Recovery Action |
| :--- | :---: | :--- | :--- |
| **Missing API Key** | Pre-flight check | Informative modal dialog | Direct link to Settings or option to use Demo Mode. |
| **Invalid Key** | HTTP 400 | Warning modal & toast | Directs user to verify their key at Google AI Studio. |
| **Permission Denied** | HTTP 403 | Warning modal & toast | Alerts user that key lacks permission for the model. |
| **Endpoint Missing** | HTTP 404 | Warning modal & toast | Confirms status of `gemini-3.5-flash-lite` model. |
| **Quota Exceeded** | HTTP 429 | Warning modal & toast | Advises user that free-tier quota is reached; suggests waiting. |
| **Network Timeout** | 60 seconds (`AbortController`) | Error modal & toast | Aborts stalled request cleanly without hanging the UI. |
| **Malformed Response** | Invalid JSON / Schema failure | Diagnostic modal & toast | Details schema mismatch; never injects corrupted data. |

### Client-Side Security Guarantees
1. **Zero External Data Leaks**: Notes and topics are transmitted strictly to Google's official Gemini endpoint.
2. **Key Isolation**: The Gemini API key is isolated in `localStorage` under `studymate_api_key` and is excluded from JSON export files and crash logs.
3. **XSS Protection**: All user input, notes, and AI-generated text are escaped using HTML entity replacement (`&`, `<`, `>`, `"`, `'`) before being rendered into the DOM.
4. **No Silent Fallbacks**: On AI failure, the application displays the exact error encountered rather than silently serving mock data, ensuring students always know the true origin of their study materials.

---

## 10. Browser Compatibility

StudyMate AI is built using cross-browser standard web APIs:

| Browser | Minimum Version | Status |
| :--- | :---: | :---: |
| **Google Chrome** | 80+ | Fully Supported |
| **Microsoft Edge** | 80+ | Fully Supported |
| **Mozilla Firefox** | 75+ | Fully Supported |
| **Apple Safari** | 13.1+ | Fully Supported |
| **Mobile Safari (iOS)** | 13.4+ | Fully Supported |
| **Chrome for Android** | 80+ | Fully Supported |

---

## Academic Context

*This project was developed as part of the B.Tech Semester 3 Web Technology curriculum, focusing on standard-compliant, dependency-free web engineering, accessible UI architectures, client-side persistence, and AI API integration.*
