# StudyMate AI — Your Personal AI Study Assistant

> **Phase 3: AI API Integration & Response Validation**  
> A modern, responsive, student-centric web application engineered to transform raw lecture notes into structured summaries, multiple-choice quizzes, and interactive 3D flashcards using the Google Gemini AI API (`gemini-3.5-flash-lite`).

---

## 1. Project Overview

**StudyMate AI** is designed to streamline exam preparation and study routines for students. By transforming unstructured, dense class notes into structured summaries, practice quizzes, and interactive flashcard decks, it bridges the gap between passive reading and active recall learning.

### Current Development Stage: Phase 3
Building on the frontend foundation (Phase 1) and interactive learning interfaces (Phase 2), **Phase 3** connects live artificial intelligence via Google Gemini:

- **Google Gemini API Integration**: Direct client-side connection to `gemini-3.5-flash-lite` using native `fetch()` and `AbortController`.
- **API Key Management**: Secure client-side storage in `localStorage` (`studymate_api_key`), credential masking, visibility toggling, and easy key removal with confirmation.
- **Connection Diagnostics**: Instant one-click connection test button (`#btn-test-connection`) with visual feedback verifying API key validity and model accessibility before generating study materials.
- **Prompt Engineering**: Highly specialized prompt instructing Gemini to return strict JSON containing formatted summary paragraphs, key takeaways, concept definitions, a 5-question multiple-choice quiz, and 6+ active recall flashcards.
- **Strict Response Validation**: Robust client-side validation ensuring valid JSON syntax, required fields, non-empty text, exactly 5 quiz questions with 4 options each, valid answer indices (0–3), and at least 6 flashcards.
- **Comprehensive Error Handling**: Descriptive, user-friendly error messages mapped to HTTP response codes (400, 401, 403, 404, 429, 500, 503) and 60-second network timeouts.
- **Explicit Demo Mode**: Curated sample datasets remain available via a dedicated "Try Demo Mode" button (`#btn-demo-mode`), allowing offline or keyless testing without silent fallback on AI failure.
- **Live Session Statistics**: Real-time tracking of study sessions generated, quizzes completed, and running arithmetic average quiz score.

---

## 2. Technology Stack

Built strictly adhering to native web standards without external libraries, packages, or build tools:

- **HTML5**: Semantic document structure (`<header>`, `<nav>`, `<aside>`, `<main>`, `<section>`, `<fieldset>`, `<dialog>`), full W3C ARIA tab, radiogroup, and dialog patterns.
- **CSS3**: CSS Custom Properties (Design Tokens) for seamless light/dark theming, CSS Grid, Flexbox, 3D perspective transforms (`rotateY`), and `@media (prefers-reduced-motion)` support.
- **Vanilla JavaScript (ES6+)**: Pure standard modular JavaScript with strict separation of concerns, native Fetch API, `AbortController` timeouts, Blob/Clipboard APIs, and safe text injection (`textContent` and HTML escaping).
- **Google Gemini API**: Uses the official REST endpoint `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent` with `responseMimeType: "application/json"`.
- **System Font Stack**: High-performance system fonts (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto...`) eliminating external network delays.
- **Native Inline SVGs**: Scalable vector icons embedded directly into HTML/CSS without external icon CDNs (e.g., FontAwesome, Lucide).

---

## 3. Project File Structure

```text
StudyMateAI/
├── index.html        # Complete semantic HTML5 structure for dashboard, tabs, modals, & toast
├── style.css         # Design system tokens, light/dark themes, 3D flip card, & responsive styles
├── script.js         # Modular JavaScript engine: Gemini AI client, prompt builder, quiz, & flashcards
└── README.md         # Comprehensive project documentation and developer guide
```

---

## 4. How to Run the Application

Because StudyMate AI uses pure native web technologies, no installation, bundler, or Node.js runtime is required.

### Method 1: VS Code Live Server (Recommended)
1. Open the `StudyMateAI` project folder in **Visual Studio Code**.
2. If you don't already have it installed, install the **Live Server** extension by *Ritwick Dey* from the Extensions marketplace (`Ctrl+Shift+X` / `Cmd+Shift+X`).
3. Right-click on `index.html` in the file explorer and select **Open with Live Server**.
4. The application will launch in your default browser at `http://127.0.0.1:5500/index.html`.

### Method 2: Direct Browser Execution
1. Navigate to the `StudyMateAI` directory in your file manager (Finder on macOS or Explorer on Windows).
2. Double-click `index.html` or drag and drop it into any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari).

---

## 5. Configuring Google Gemini AI

To generate dynamic study materials from your own custom notes:

### 1. Obtain a Free Google Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **Get API key** and create a new key.
4. Copy the generated key (typically starts with `AIzaSy...`).

### 2. Enter and Save the Key in StudyMate AI
1. In the application sidebar or mobile menu, navigate to **Settings**.
2. Under **AI Provider Configuration**, paste your API key into the **Gemini API Key** field.
3. Click **Save API Key**. The key is securely saved to your browser's `localStorage` (`studymate_api_key`) and the configuration status badge updates to **Configured (Gemini 3.5 Flash-Lite)**.
4. Click **Test Connection** to immediately verify your key against Google Gemini. A green confirmation banner indicates that the model is ready.

### 3. Security Considerations
- **Client-Side Storage**: The API key is stored exclusively in your browser's `localStorage`. It is never transmitted to any third-party server other than directly to Google's official Gemini endpoint.
- **Public Computers**: Do not store personal API keys on shared or public workstations. Click **Remove Key** in Settings before leaving a shared machine.
- **No Hardcoded Keys**: The application repository contains zero hardcoded API keys.

---

## 6. How to Generate Study Material

### Option A: Generate with AI (Google Gemini)
1. **Enter Study Topic (Optional)**: Type the subject of study in the topic input field (e.g., `Thermodynamics`, `Cell Biology`, `Quantum Computing`).
2. **Paste Study Notes**: Paste lecture notes, textbook excerpts, or revision points into the notes textarea (up to 10,000 characters with live character counter).
3. **Select Quiz Difficulty**:
   - **Easy**: Fundamental terminology and core definitions.
   - **Medium**: Standard conceptual applications and mechanics.
   - **Hard**: Architectural nuances, edge cases, and complex scenarios.
4. **Select Summary Style**:
   - **Simple Explanation**: Everyday analogies and straightforward English.
   - **Exam-Focused**: Formulas, high-yield bullet points, and key rules.
   - **Detailed Notes**: In-depth textbook-style hierarchy and technical analysis.
5. **Click "Generate with AI"**:
   - JavaScript validates note length and verifies API key configuration.
   - The button enters a loading state (`Generating with AI...` with animated spinner).
   - An asynchronous POST request is dispatched to Google Gemini (`gemini-3.5-flash-lite`).
   - The JSON response is parsed, validated, and normalized into application state.
   - The workspace smoothly scrolls into view with active **Summary**, **Quiz**, and **Flashcards** tabs.

### Option B: Try Demo Mode (Sample Data)
- If you don't have an API key or want to test the application offline, click **Try Demo Mode**.
- The application automatically matches your topic and notes against curated Computer Science knowledge sets (Data Structures, OS, DBMS, Networks, JavaScript, or a General Fallback) and renders complete sample materials immediately without network requests.
- All demo outputs are clearly badged as `Demo Mode — Sample Study Material`.

---

## 7. Interactive Learning Features

### A. Summary Tab
- **Structured Reading**: Executive overview, formatted paragraphs, key takeaways with checkmark indicators, and core concept definition cards.
- **Source Badge**: Identifies whether the material was generated via `AI Generated (Gemini 3.5 Flash-Lite)` or `Demo Mode`.
- **Copy Summary**: Extracts formatted plain text and copies it to the system clipboard using `navigator.clipboard.writeText` (with an automatic fallback for restricted environments).
- **Download Summary**: Generates a downloadable text file (`[topic]-summary.txt`) using the HTML5 `Blob` and `URL.createObjectURL` APIs.

### B. Interactive Quiz Engine
- **5 Questions Per Quiz**: Generated specifically to match the selected difficulty level.
- **Bidirectional Navigation**: "Previous" and "Next" controls, alongside quick-jump indicator dots (1 to 5).
- **Persistent Answer State**: Answers remain selected when navigating back and forth across questions.
- **Submission Safeguards**: If submitted with unanswered questions, a modal dialog warns the user and gives the option to review or proceed.
- **Scoring Formula**:
  $$\text{Score Percentage} = \left(\frac{\text{Correct Answers}}{\text{Total Questions}}\right) \times 100$$
- **Results & Review**:
  - Score badge, percentage, and qualitative performance evaluation.
  - Question-by-question review highlighting the user's answer (green for correct, red for incorrect), the actual correct answer, and an in-depth explanation box.
- **Retake Quiz**: Clears previous selections, restores question 1, and allows a fresh re-attempt without duplicate stats counting.

### C. Interactive 3D Flashcards
- **Realistic 3D Flip**: Click or press `Space` / `Enter` on a focused card to trigger a smooth 180° CSS perspective flip.
- **Spaced Repetition Tracking**:
  - **Mark as Known** (`✓ Known` badge).
  - **Needs Review** (`⚠️ Needs Review` badge).
  - Classification counts update dynamically without duplicate counting if reclassified.
  - Live deck summary: `Card X of N | Known: K | Review: R | Unclassified: U`.
- **Shuffle Deck**: Implements the Fisher-Yates algorithm to randomize card order while preserving individual card classifications.
- **Navigation**: "Previous Card" and "Next Card" buttons; flipping automatically resets to the front face on card change.

### D. Dashboard Quick Statistics
Updated in real-time in JavaScript application state:
- **Study Sessions**: Increments each time new study material is generated.
- **Quizzes Completed**: Increments on the first submission of each unique quiz attempt.
- **Average Quiz Score**: Calculated as the arithmetic mean of percentage scores across completed quizzes.

---

## 8. Error Handling & Resilience

StudyMate AI includes extensive error handling to guarantee a smooth user experience under all conditions:

| Scenario | Application Behavior |
| :--- | :--- |
| **Missing API Key** | Modal dialog guides the user to Settings or offers to use Demo Mode. No silent errors. |
| **Invalid API Key (HTTP 400)** | Clear error alert directing the user to verify their key at `aistudio.google.com`. |
| **Permission Denied (HTTP 403)** | Explains that the key lacks permission for the `gemini-3.5-flash-lite` model. |
| **Rate Limit / Quota (HTTP 429)** | Alerts user that Google AI Studio free tier quota was reached and advises waiting. |
| **Network Timeout (60s)** | AbortController terminates slow requests and notifies user of connection timeout. |
| **Malformed AI Response** | Strict schema validator catches incomplete JSON and displays diagnostic details. |
| **API Failure Fallback Policy** | The application **never** silently substitutes sample data on AI failure; it displays the exact error so students always know the true origin of their study materials. |

---

## 9. Phased Development Roadmap

| Phase | Milestone | Status | Key Deliverables |
| :--- | :--- | :---: | :--- |
| **Phase 1** | **Project Foundation & UI Development** | **Completed** | Full responsive layout, design system, theme switching, accessible tabs, character counting, and validation. |
| **Phase 2** | **Study Material Generation & Interactive Learning** | **Completed** | Sample study material generator, summary copy/download, 5-question multi-choice quiz engine, 3D flashcards with mastery tracking. |
| **Phase 3** | **Google Gemini AI Integration** | **Completed** | Live client-side connection to Google Gemini API (`gemini-3.5-flash-lite`), key management, connection testing, schema validation, and error handling. |
| **Phase 4** | **History & Learning Analytics** | *Scheduled Next* | LocalStorage persistence engine, searchable study history, score trend charts, and export tools. |
