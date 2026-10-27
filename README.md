# StudyMate AI — Your Personal AI Study Assistant

> **Phase 1: Project Foundation & UI Development**  
> A modern, responsive, student-centric web application designed to transform lecture notes into concise summaries, multiple-choice quizzes, and active recall flashcards.

---

## 1. Project Overview

**StudyMate AI** is designed to streamline exam preparation and study routines for students. By transforming unstructured, dense class notes into structured summaries, practice quizzes, and interactive flashcard decks, it bridges the gap between passive reading and active learning.

### Current Stage: Phase 1 Foundation
This release marks the completion of **Phase 1: Project Foundation & UI Development**. It provides:
- A complete frontend foundation.
- Responsive SaaS dashboard layout (persistent sidebar on desktop, collapsible drawer on mobile).
- Semantic HTML5 structure and clean CSS custom property design system.
- Light and dark theme switching with LocalStorage persistence.
- Interactive tabbed workspace with empty states.
- Client-side input validation, character limit counter (10,000 characters maximum), and clear confirmation dialogs.
- Clear structural integration points for future phases.

> **Important Notice:** The Google Gemini AI API has **not** yet been integrated in Phase 1. All AI generation, live quiz engines, and persistent history tracking are strictly scheduled for subsequent development phases. No fake network requests or simulated API responses are generated.

---

## 2. Technologies Used

Built strictly adhering to native browser standards without external dependencies or build tools:

- **HTML5**: Semantic document outline (`<header>`, `<nav>`, `<aside>`, `<main>`, `<section>`, `<fieldset>`, `<dialog>`), full ARIA tab and dialog patterns, accessible labels and skip links.
- **CSS3**: CSS Custom Properties (Tokens) for fluid theming, CSS Grid, Flexbox, smooth transitions, and `@media (prefers-reduced-motion)` support.
- **Vanilla JavaScript (ES6+)**: Pure standard modular JavaScript with strict separation of concerns, native DOM event handling (`addEventListener`), and LocalStorage API.
- **System Font Stack**: Standard native system fonts (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto...`) eliminating third-party font download delays.
- **Native Inline SVGs**: Scalable vector icons embedded directly into HTML/CSS without external icon CDNs (e.g., FontAwesome, Lucide).

---

## 3. Project File Structure

```text
StudyMateAI/
├── index.html        # Complete semantic HTML5 structure for all 5 sections & modals
├── style.css         # Design system tokens, light/dark themes, and responsive styles
├── script.js         # Modular JavaScript engine for navigation, tabs, theme, & validation
└── README.md         # Comprehensive project documentation and developer guide
```

---

## 4. Features Implemented in Phase 1

### A. Responsive Dashboard Shell
- **Persistent Sidebar Navigation** on desktop viewports with brand logo, badge, and 5 core sections:
  1. **Dashboard**
  2. **History**
  3. **Progress**
  4. **Settings**
  5. **About**
- **Mobile Navigation Drawer** with smooth slide-in animation, backdrop overlay, hamburger toggle, and Escape key dismissal.
- **Top Navigation Bar** displaying dynamic section titles, subtitles, dark/light theme switch, and decorative student profile avatar.

### B. Dashboard Section
- **Welcome Banner**: Introductory orientation and feature badges.
- **Quick Statistics Cards**: Three initialized metrics (*Study Sessions: 0*, *Quizzes Completed: 0*, *Average Quiz Score: 0%*) without fake figures.
- **Study Input Card**:
  - Optional topic input.
  - Large study notes textarea with live character counter (`X / 10,000 characters`) and strict boundary enforcement.
  - Quiz Difficulty selector (Easy, Medium [default], Hard).
  - Summary Style selector (Simple Explanation [default], Exam-Focused, Detailed Notes).
  - Prominent **Generate Study Material** button with input validation (alerts if notes are empty or too brief).
  - **Clear Input** button with accessible confirmation dialog.
- **Study Material Workspace**:
  - Accessible three-tab panel interface (**Summary**, **Quiz**, **Flashcards**) with W3C keyboard arrow key navigation.
  - Informative, styled empty states detailing each upcoming feature.

### C. History Section
- Clean layout with search input, material type filter, and clear history action (disabled/tagged for Phase 4).
- Polished empty state explaining that generated sessions will appear here once saved in local storage.

### D. Progress Section
- Learning analytics summary cards (*Total Study Sessions*, *Quizzes Attempted*, *Average Score*, *Best Score*).
- Polished empty chart container featuring native SVG coordinate grid lines and explanation of future trend visualization.
- Recent study activity placeholder log.

### E. Settings Section
- **AI Configuration**: Google Gemini provider selector, password input with show/hide eye toggle, Stage Key and Remove Key controls, and explicit client-side security warnings.
- **Appearance**: Light Theme and Dark Theme radio cards with visual previews, live theme switching, and LocalStorage persistence.
- **Study Preferences**: Default difficulty, summary style, and flashcard animation settings stored and synchronized with dashboard defaults.
- **Data Management**: Reset Application Preferences with confirmation modal, and placeholders for history/progress reset tools.

### F. About Section
- Application mission statement and educational purpose.
- Technology stack overview and architectural philosophy.
- Development roadmap highlighting milestones for all four phases.

### G. Design System & Theme Engine
- Dual theme system designed with intentional slate, indigo, and violet color palettes.
- Auto-detection of system dark mode preference with manual override stored in `localStorage`.
- Smooth transitions and high contrast meeting accessibility standards.

---

## 5. How to Run the Application

Because StudyMate AI uses pure native web technologies, no installation, bundler, or Node.js runtime is required.

### Method 1: VS Code Live Server (Recommended)
1. Open the `StudyMateAI` project directory in **Visual Studio Code**.
2. If you don't already have it installed, search for the **Live Server** extension by *Ritwick Dey* in the Extensions tab (`Ctrl+Shift+X` / `Cmd+Shift+X`).
3. Right-click on `index.html` in the file explorer and select **Open with Live Server**.
4. The application will launch in your default browser at `http://127.0.0.1:5500/index.html`.

### Method 2: Direct Browser Execution
1. Navigate to the `StudyMateAI` directory in your file manager (Finder or Explorer).
2. Double-click `index.html` or drag and drop it into any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

---

## 6. Development Roadmap & Phased Boundaries

| Phase | Milestone | Status | Details |
| :--- | :--- | :---: | :--- |
| **Phase 1** | **Project Foundation & UI Development** | **Completed** | Full responsive UI, design system, theme switching, tabs, validation, navigation, modals. |
| **Phase 2** | **Study Workspace Engine** | *Scheduled Next* | Client-side interactive quiz scoring, hint engine, and 3D flip flashcard decks. |
| **Phase 3** | **Google Gemini AI Integration** | *Scheduled Next* | Live client-side connection to Google Gemini API for automated note extraction & generation. |
| **Phase 4** | **History & Learning Analytics** | *Scheduled Next* | LocalStorage persistence engine, searchable study history, performance charts, and exports. |

### Features Intentionally Deferred to Later Phases
To maintain strict architectural boundaries, the following are deliberately **not** implemented in Phase 1:
- Live network requests to Google Gemini or external AI endpoints.
- Persistent API key storage in encrypted browser cookies or backend vaults.
- Fake AI summaries, mock questions, or synthesized flashcard decks.
- Quiz score calculation and active test evaluation.
- LocalStorage history database for past sessions.
- Dynamic performance charting libraries or fabricated graph points.

