# StudyMate AI — Your Personal AI Study Assistant

> **Phase 2: Study Material Generation & Interactive Learning**  
> A modern, responsive, student-centric web application engineered to transform lecture notes into structured summaries, multiple-choice quizzes, and interactive 3D flashcards.

---

## 1. Project Overview

**StudyMate AI** is designed to streamline exam preparation and study routines for students. By transforming unstructured, dense class notes into structured summaries, practice quizzes, and interactive flashcard decks, it bridges the gap between passive reading and active recall learning.

### Current Development Stage: Phase 2
Following the frontend foundation established in Phase 1, **Phase 2** activates the core study and learning engine using curated educational datasets and pure client-side JavaScript:
- **Sample Study Material Generation**: Input validation, keyword matching across five fundamental Computer Science domains, and a general demonstration fallback.
- **Dynamic Summaries**: Formatted multi-paragraph overviews, key takeaways, and core concept definition cards across three distinct styles (Simple Explanation, Exam-Focused, Detailed Notes).
- **Summary Actions**: One-click Clipboard copy and native text file download (`.txt`) using the Blob and URL Object APIs.
- **Interactive Quiz Engine**: 5 multiple-choice questions tailored to the selected difficulty (Easy, Medium, Hard), bidirectional navigation, unanswered question safeguards, automated scoring, answer explanations, and retake functionality.
- **Interactive Flashcards**: Smooth 3D flip animation, keyboard accessibility (`Space` / `Enter`), deck shuffling via Fisher-Yates, and persistent in-session mastery classification (`Known` vs `Needs Review`).
- **Live Session Statistics**: Real-time tracking of study sessions generated, quizzes completed, and running arithmetic average quiz score.

> **Important Architecture Notice:** Study materials in Phase 2 are powered by **local predefined educational datasets**. The application clearly identifies sample content with a `Demo Mode` badge. Real-time dynamic AI generation via Google Gemini will be connected in **Phase 3**. No fake network requests or fabricated API responses are generated.

---

## 2. Technology Stack

Built strictly adhering to native web standards without external libraries, packages, or build tools:

- **HTML5**: Semantic document structure (`<header>`, `<nav>`, `<aside>`, `<main>`, `<section>`, `<fieldset>`, `<dialog>`), full W3C ARIA tab, radiogroup, and dialog patterns.
- **CSS3**: CSS Custom Properties (Design Tokens) for seamless light/dark theming, CSS Grid, Flexbox, 3D perspective transforms (`rotateY`), and `@media (prefers-reduced-motion)` support.
- **Vanilla JavaScript (ES6+)**: Pure standard modular JavaScript with strict separation of concerns, native DOM event handling (`addEventListener`), Blob/Clipboard APIs, and safe text injection (`textContent` and HTML escaping).
- **System Font Stack**: High-performance system fonts (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto...`) eliminating external network delays.
- **Native Inline SVGs**: Scalable vector icons embedded directly into HTML/CSS without external icon CDNs (e.g., FontAwesome, Lucide).

---

## 3. Project File Structure

```text
StudyMateAI/
├── index.html        # Complete semantic HTML5 structure for dashboard, tabs, modals, & toast
├── style.css         # Design system tokens, light/dark themes, 3D flip card, & responsive styles
├── script.js         # Modular JavaScript engine: sample datasets, quiz engine, & flashcards
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

## 5. How to Generate Study Material

1. **Enter Study Topic (Optional)**: Type the subject of study in the topic input field (e.g., `Data Structures`, `Operating Systems`, `DBMS`, `Computer Networks`, `JavaScript`).
2. **Paste Study Notes**: Paste lecture notes, textbook excerpts, or revision points into the notes textarea (up to 10,000 characters with live character counter).
3. **Select Quiz Difficulty**:
   - **Easy**: Fundamental terminology and core definitions.
   - **Medium**: Standard conceptual applications and mechanics.
   - **Hard**: Architectural nuances, edge cases, and complex scenarios.
4. **Select Summary Style**:
   - **Simple Explanation**: Everyday analogies and straightforward English.
   - **Exam-Focused**: Formulas, high-yield bullet points, and key rules.
   - **Detailed Notes**: In-depth textbook-style hierarchy and technical analysis.
5. **Click "Generate Study Material"**:
   - JavaScript validates that notes are not empty and contain at least 15 characters.
   - The engine selects the appropriate educational dataset and populates the **Summary**, **Quiz**, and **Flashcards** tabs.
   - The user is automatically transitioned to the generated summary view, and the dashboard statistics update.

---

## 6. Sample Dataset Selection

The application includes five dedicated core Computer Science datasets plus a general demonstration fallback:

| Dataset | Sample Keywords | Question Pool | Flashcards |
| :--- | :--- | :---: | :---: |
| **Data Structures & Algorithms** | `data structures`, `dsa`, `arrays`, `linked list`, `stack`, `queue`, `binary tree`, `bst`, `hash table`, `graph` | 15 Questions (5 Easy, 5 Med, 5 Hard) | 6 Cards |
| **Operating Systems & Concurrency** | `operating systems`, `os`, `process`, `thread`, `deadlock`, `scheduling`, `virtual memory`, `paging`, `semaphore` | 15 Questions (5 Easy, 5 Med, 5 Hard) | 6 Cards |
| **Database Management Systems** | `database`, `dbms`, `sql`, `normalization`, `acid`, `primary key`, `transaction`, `b-tree`, `indexing` | 15 Questions (5 Easy, 5 Med, 5 Hard) | 6 Cards |
| **Computer Networks & Protocols** | `computer networks`, `cn`, `tcp`, `udp`, `ip`, `osi`, `routing`, `dns`, `http`, `subnetting` | 15 Questions (5 Easy, 5 Med, 5 Hard) | 6 Cards |
| **JavaScript Fundamentals** | `javascript`, `js`, `es6`, `closure`, `event loop`, `promises`, `async/await`, `hoisting`, `prototype` | 15 Questions (5 Easy, 5 Med, 5 Hard) | 6 Cards |
| **General Demonstration Dataset** | Fallback for uncataloged topics (e.g. History, Biology, Physics, or unclassified notes) | 15 Questions (5 Easy, 5 Med, 5 Hard) | 6 Cards |

*Note: For unrecognized topics, the application displays a clear label: `Demo Mode — General Demonstration Dataset (Unrecognized Topic)` so users understand that content is illustrative.*

---

## 7. Interactive Learning Features

### A. Summary Tab
- **Structured Reading**: Executive overview, formatted paragraphs, key takeaways with checkmark indicators, and core concept definition cards.
- **Copy Summary**: Extracts formatted plain text and copies it to the system clipboard using `navigator.clipboard.writeText` (with an automatic fallback for restricted environments).
- **Download Summary**: Generates a downloadable text file (`[topic]-summary.txt`) using the HTML5 `Blob` and `URL.createObjectURL` APIs.

### B. Interactive Quiz Engine
- **5 Questions Per Quiz**: Selected dynamically based on the chosen difficulty level.
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

## 8. Current Limitations

1. **Predefined Knowledge Base**: Generated study materials are drawn from local sample datasets rather than dynamic live LLM text processing.
2. **In-Memory Tracking**: Quiz scores, flashcard classifications, and session counts exist in JavaScript state for the duration of the browser session and are not yet persisted across hard page refreshes.
3. **Fixed Question Counts**: Quizzes feature five questions per difficulty level to ensure consistent evaluation.

---

## 9. Phased Development Roadmap

| Phase | Milestone | Status | Key Deliverables |
| :--- | :--- | :---: | :--- |
| **Phase 1** | **Project Foundation & UI Development** | **Completed** | Full responsive layout, design system, theme switching, accessible tabs, character counting, and validation. |
| **Phase 2** | **Study Material Generation & Interactive Learning** | **Completed** | Sample study material generator, summary copy/download, 5-question multi-choice quiz engine, 3D flashcards with mastery tracking. |
| **Phase 3** | **Google Gemini AI Integration** | *Scheduled Next* | Live client-side connection to Google Gemini API for automated note extraction, prompt engineering, and dynamic question generation. |
| **Phase 4** | **History & Learning Analytics** | *Scheduled Next* | LocalStorage persistence engine, searchable study history, score trend charts, and export tools. |

### Features Intentionally Deferred to Phase 3 & 4
- Live network requests to Google Gemini or external AI APIs (Phase 3).
- Persistent API key storage and management (Phase 3).
- LocalStorage history database for past study sessions (Phase 4).
- Persistent quiz analytics and score trend visualization charts (Phase 4).
