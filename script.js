/**
 * ============================================================================
 * StudyMate AI — Phase 1: Frontend Architecture & UI Engine
 * Pure Vanilla JavaScript (ES6+)
 * Strictly Zero External Frameworks, Libraries, or Dependencies
 * ============================================================================
 */

'use strict';

/**
 * Application State Container
 * Encapsulates client-side state without cluttering the global namespace.
 */
const AppState = {
  currentSection: 'dashboard',
  currentTab: 'summary',
  theme: 'light',
  maxNoteLength: 10000,
  preferences: {
    defaultDifficulty: 'Medium',
    defaultSummaryStyle: 'Simple Explanation',
    flashcardAnimation: 'flip'
  },
  apiKey: ''
};

/**
 * Section Metadata
 * Titles and descriptions displayed in the sticky top navigation bar.
 */
const SECTION_METADATA = {
  dashboard: {
    title: 'Dashboard',
    description: 'Create and manage your AI-powered study materials'
  },
  history: {
    title: 'Study History',
    description: 'Review previous study sessions and practice runs'
  },
  progress: {
    title: 'Learning Analytics',
    description: 'Track your quiz accuracy, study velocity, and topic mastery'
  },
  settings: {
    title: 'Application Settings',
    description: 'Manage your AI API connection, appearance theme, and study preferences'
  },
  about: {
    title: 'About StudyMate AI',
    description: 'Project overview, technology stack, and engineering roadmap'
  }
};

/**
 * Storage Keys Constants
 */
const STORAGE_KEYS = {
  THEME: 'studymate_theme',
  PREFERENCES: 'studymate_preferences'
};

/* ============================================================================
   INITIALIZATION BOOTSTRAPPER
   ============================================================================ */

/**
 * Main application bootstrapper.
 * Executes once the DOM is fully loaded and ready.
 */
function initializeApp() {
  initializeTheme();
  initializeNavigation();
  initializeMobileMenu();
  initializeTabs();
  initializeCharacterCounter();
  initializeStudyForm();
  initializeSettings();
  initializeConfirmationDialogs();

  // Handle URL hash navigation on direct load (e.g., #settings)
  handleInitialHash();
}

/**
 * Read the URL hash if provided and switch to that section if valid.
 */
function handleInitialHash() {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  if (hash && SECTION_METADATA[hash]) {
    switchSection(hash);
  }
}

/* ============================================================================
   THEME SWITCHER & LOCAL STORAGE
   ============================================================================ */

/**
 * Initializes the visual theme based on LocalStorage or system preference.
 */
function initializeTheme() {
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  } catch (err) {
    console.warn('LocalStorage is unavailable or restricted:', err);
  }

  if (savedTheme === 'light' || savedTheme === 'dark') {
    AppState.theme = savedTheme;
  } else {
    // Detect system OS preference as fallback
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    AppState.theme = systemPrefersDark ? 'dark' : 'light';
  }

  applyTheme(AppState.theme, false);

  // Setup header theme toggle button event listener
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Listen for system theme changes if user hasn't explicitly set a preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      try {
        if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
          applyTheme(e.matches ? 'dark' : 'light', false);
        }
      } catch (err) {
        // Quietly ignore storage errors
      }
    });
  }
}

/**
 * Applies a specific theme to the document and updates UI state.
 * @param {'light'|'dark'} theme 
 * @param {boolean} persist - Whether to store in LocalStorage
 */
function applyTheme(theme, persist = true) {
  AppState.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);

  // Update theme toggle button accessibility labels
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    const nextThemeLabel = theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
    themeToggleBtn.setAttribute('aria-label', nextThemeLabel);
    themeToggleBtn.setAttribute('title', nextThemeLabel);
  }

  // Update settings appearance radio buttons if present
  const lightRadio = document.getElementById('theme-radio-light');
  const darkRadio = document.getElementById('theme-radio-dark');
  const lightCard = document.getElementById('theme-card-light');
  const darkCard = document.getElementById('theme-card-dark');
  const themeStatusIndicator = document.getElementById('theme-status-indicator');

  if (lightRadio && darkRadio) {
    lightRadio.checked = (theme === 'light');
    darkRadio.checked = (theme === 'dark');

    if (lightCard && darkCard) {
      lightCard.classList.toggle('selected', theme === 'light');
      darkCard.classList.toggle('selected', theme === 'dark');
    }
  }

  if (themeStatusIndicator) {
    themeStatusIndicator.textContent = `Current: ${theme === 'light' ? 'Light' : 'Dark'} Mode (Persisted in LocalStorage)`;
  }

  // Persist preference safely
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (err) {
      console.warn('Unable to persist theme to LocalStorage:', err);
    }
  }
}

/**
 * Toggles between light and dark theme.
 */
function toggleTheme() {
  const newTheme = AppState.theme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme, true);
  showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Theme`, 'info');
}

/* ============================================================================
   NAVIGATION & SECTION SWITCHING
   ============================================================================ */

/**
 * Initializes navigation event handlers.
 */
function initializeNavigation() {
  const navButtons = document.querySelectorAll('.nav-link[data-section]');
  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetSection = button.getAttribute('data-section');
      if (targetSection) {
        switchSection(targetSection);
        // On mobile, close navigation drawer after selection
        closeMobileMenu();
      }
    });
  });

  // Brand link clicks return to dashboard
  const brandHomeLink = document.getElementById('brand-home-link');
  if (brandHomeLink) {
    brandHomeLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchSection('dashboard');
      closeMobileMenu();
    });
  }

  // Listen to popstate for browser back/forward navigation
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash && SECTION_METADATA[hash]) {
      switchSection(hash, false);
    } else {
      switchSection('dashboard', false);
    }
  });
}

/**
 * Switches the active application section without page reload.
 * @param {string} sectionId - The ID of the target section
 * @param {boolean} updateHistory - Whether to push state to history
 */
function switchSection(sectionId, updateHistory = true) {
  if (!SECTION_METADATA[sectionId]) {
    sectionId = 'dashboard';
  }

  AppState.currentSection = sectionId;

  // Update navigation link active states
  const navButtons = document.querySelectorAll('.nav-link[data-section]');
  navButtons.forEach((btn) => {
    const isTarget = btn.getAttribute('data-section') === sectionId;
    btn.classList.toggle('active', isTarget);
    if (isTarget) {
      btn.setAttribute('aria-current', 'page');
    } else {
      btn.removeAttribute('aria-current');
    }
  });

  // Toggle active content section visibility
  const sections = document.querySelectorAll('.app-section');
  sections.forEach((section) => {
    const isTarget = section.id === `section-${sectionId}`;
    if (isTarget) {
      section.removeAttribute('hidden');
      section.classList.add('active');
    } else {
      section.setAttribute('hidden', '');
      section.classList.remove('active');
    }
  });

  // Update top bar dynamic title and description
  const titleEl = document.getElementById('current-section-title');
  const descEl = document.getElementById('current-section-desc');
  if (titleEl && descEl && SECTION_METADATA[sectionId]) {
    titleEl.textContent = SECTION_METADATA[sectionId].title;
    descEl.textContent = SECTION_METADATA[sectionId].description;
  }

  // Update URL hash smoothly without reloading
  if (updateHistory) {
    history.pushState(null, '', `#${sectionId}`);
  }

  // Scroll to top of main content smoothly
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.scrollTop = 0;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================================================
   MOBILE MENU DRAWER
   ============================================================================ */

/**
 * Initializes mobile hamburger menu and drawer backdrop interactions.
 */
function initializeMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('sidebar-close-btn');
  const backdrop = document.getElementById('drawer-backdrop');

  if (menuBtn) {
    menuBtn.addEventListener('click', toggleMobileMenu);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMobileMenu);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMobileMenu);
  }

  // Close drawer on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const sidebar = document.getElementById('sidebar');
      if (sidebar && sidebar.classList.contains('open')) {
        closeMobileMenu();
      }
    }
  });
}

/**
 * Toggles mobile drawer state.
 */
function toggleMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar && sidebar.classList.contains('open')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

/**
 * Opens mobile navigation drawer.
 */
function openMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('drawer-backdrop');
  const menuBtn = document.getElementById('mobile-menu-btn');

  if (sidebar) sidebar.classList.add('open');
  if (backdrop) backdrop.classList.add('active');
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');

  // Prevent background body scrolling while drawer is active
  document.body.style.overflow = 'hidden';
}

/**
 * Closes mobile navigation drawer.
 */
function closeMobileMenu() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('drawer-backdrop');
  const menuBtn = document.getElementById('mobile-menu-btn');

  if (sidebar) sidebar.classList.remove('open');
  if (backdrop) backdrop.classList.remove('active');
  if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');

  document.body.style.overflow = '';
}

/* ============================================================================
   WORKSPACE TABS COMPONENT
   ============================================================================ */

/**
 * Initializes accessible tabs for the Study Material Workspace.
 * Follows W3C WAI-ARIA tab pattern with keyboard navigation support.
 */
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn[role="tab"]');

  tabButtons.forEach((tab, index) => {
    // Click listener
    tab.addEventListener('click', () => {
      activateTab(tab);
    });

    // Keyboard navigation (ArrowLeft / ArrowRight / Home / End)
    tab.addEventListener('keydown', (e) => {
      let targetTab = null;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        targetTab = tabButtons[(index + 1) % tabButtons.length];
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        targetTab = tabButtons[(index - 1 + tabButtons.length) % tabButtons.length];
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetTab = tabButtons[0];
      } else if (e.key === 'End') {
        e.preventDefault();
        targetTab = tabButtons[tabButtons.length - 1];
      }

      if (targetTab) {
        targetTab.focus();
        activateTab(targetTab);
      }
    });
  });
}

/**
 * Activates a designated tab and displays its corresponding panel.
 * @param {HTMLElement} activeTab 
 */
function activateTab(activeTab) {
  const tabButtons = document.querySelectorAll('.tab-btn[role="tab"]');
  const tabPanels = document.querySelectorAll('.tab-panel[role="tabpanel"]');
  const targetPanelId = activeTab.getAttribute('aria-controls');

  // Update tabs ARIA and visual state
  tabButtons.forEach((btn) => {
    const isTarget = (btn === activeTab);
    btn.classList.toggle('active', isTarget);
    btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    btn.setAttribute('tabindex', isTarget ? '0' : '-1');
  });

  // Update tab panels visibility
  tabPanels.forEach((panel) => {
    const isTarget = (panel.id === targetPanelId);
    if (isTarget) {
      panel.removeAttribute('hidden');
      panel.classList.add('active');
    } else {
      panel.setAttribute('hidden', '');
      panel.classList.remove('active');
    }
  });

  AppState.currentTab = targetPanelId ? targetPanelId.replace('panel-', '') : 'summary';
}

/* ============================================================================
   CHARACTER COUNTER & INPUT VALIDATION
   ============================================================================ */

/**
 * Initializes the live character counter and length enforcement for notes textarea.
 */
function initializeCharacterCounter() {
  const notesInput = document.getElementById('notes-input');
  const charCountEl = document.getElementById('char-count');
  const counterContainer = document.getElementById('char-counter-display');
  const validationAlert = document.getElementById('input-error-alert');

  if (!notesInput || !charCountEl) return;

  const updateCounter = () => {
    let currentLength = notesInput.value.length;

    // Strict boundary enforcement: Prevent entering more than 10,000 characters
    if (currentLength > AppState.maxNoteLength) {
      notesInput.value = notesInput.value.slice(0, AppState.maxNoteLength);
      currentLength = AppState.maxNoteLength;
    }

    charCountEl.textContent = currentLength.toLocaleString();

    // Style adjustments based on usage thresholds
    if (counterContainer) {
      counterContainer.classList.toggle('warning', currentLength >= 9000 && currentLength < AppState.maxNoteLength);
      counterContainer.classList.toggle('limit-reached', currentLength >= AppState.maxNoteLength);
    }

    // Hide validation error if user started typing
    if (currentLength > 0 && validationAlert && !validationAlert.hasAttribute('hidden')) {
      validationAlert.setAttribute('hidden', '');
    }
  };

  notesInput.addEventListener('input', updateCounter);
  notesInput.addEventListener('paste', () => {
    // Small timeout to allow pasted text into the value before counting
    setTimeout(updateCounter, 10);
  });
}

/**
 * Validates the study input notes field.
 * @returns {boolean} True if input is valid, false otherwise.
 */
function validateStudyInput() {
  const notesInput = document.getElementById('notes-input');
  const validationAlert = document.getElementById('input-error-alert');
  const validationText = document.getElementById('input-error-text');

  if (!notesInput) return false;

  const content = notesInput.value.trim();

  if (!content) {
    if (validationAlert && validationText) {
      validationText.textContent = 'Please paste or type study notes before generating materials.';
      validationAlert.removeAttribute('hidden');
    }
    notesInput.focus();
    return false;
  }

  // Minimum meaningful length check (at least 15 characters for a study note)
  if (content.length < 15) {
    if (validationAlert && validationText) {
      validationText.textContent = 'Notes are too brief. Please enter at least 15 characters of study material.';
      validationAlert.removeAttribute('hidden');
    }
    notesInput.focus();
    return false;
  }

  // Valid input: Hide alert
  if (validationAlert) {
    validationAlert.setAttribute('hidden', '');
  }
  return true;
}

/* ============================================================================
   STUDY INPUT FORM & GENERATE / CLEAR ACTIONS
   ============================================================================ */

/**
 * Initializes the study input form, generate button, and clear input button.
 */
function initializeStudyForm() {
  const form = document.getElementById('study-input-form');
  const clearBtn = document.getElementById('btn-clear-input');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleGenerateClick();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', handleClearClick);
  }
}

/**
 * Handles the "Generate Study Material" button click.
 * Strictly adheres to Phase 1 boundaries:
 * - Validates input.
 * - Displays an informative modal explaining that actual AI generation is scheduled for Phase 3.
 * - Does NOT perform fake API requests or simulate progress.
 */
function handleGenerateClick() {
  const isValid = validateStudyInput();
  if (!isValid) return;

  const topicInput = document.getElementById('topic-input');
  const topic = topicInput && topicInput.value.trim() ? topicInput.value.trim() : 'General Notes';

  const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked');
  const difficulty = selectedDifficulty ? selectedDifficulty.value : AppState.preferences.defaultDifficulty;

  const selectedStyle = document.querySelector('input[name="summaryStyle"]:checked');
  const summaryStyle = selectedStyle ? selectedStyle.value : AppState.preferences.defaultSummaryStyle;

  // Informative modal presentation for Phase 1
  showModal({
    title: 'Study Material Request Validated',
    message: `Your study input for "${topic}" (${difficulty} difficulty, ${summaryStyle} format) is ready for processing.\n\nIn Phase 1, UI and foundation components are active. Automated AI generation via the Google Gemini API will be integrated in Phase 3. No synthetic data is fabricated.`,
    confirmText: 'Got it',
    showCancel: false,
    iconType: 'info'
  });
}

/**
 * Handles clearing the study input with confirmation if text exists.
 */
function handleClearClick() {
  const topicInput = document.getElementById('topic-input');
  const notesInput = document.getElementById('notes-input');

  const hasTopic = topicInput && topicInput.value.trim().length > 0;
  const hasNotes = notesInput && notesInput.value.trim().length > 0;

  if (!hasTopic && !hasNotes) {
    showToast('Input fields are already empty', 'info');
    return;
  }

  // Open confirmation dialog
  showModal({
    title: 'Clear Study Input?',
    message: 'Are you sure you want to clear your topic and study notes? Any unsaved text will be removed.',
    confirmText: 'Clear All',
    cancelText: 'Keep Notes',
    isDanger: true,
    iconType: 'warning',
    onConfirm: () => {
      clearStudyInput();
      showToast('Study input cleared', 'info');
    }
  });
}

/**
 * Clears topic and notes input fields and resets the character count.
 */
function clearStudyInput() {
  const topicInput = document.getElementById('topic-input');
  const notesInput = document.getElementById('notes-input');
  const charCountEl = document.getElementById('char-count');
  const counterContainer = document.getElementById('char-counter-display');
  const validationAlert = document.getElementById('input-error-alert');

  if (topicInput) topicInput.value = '';
  if (notesInput) notesInput.value = '';
  if (charCountEl) charCountEl.textContent = '0';

  if (counterContainer) {
    counterContainer.classList.remove('warning', 'limit-reached');
  }

  if (validationAlert) {
    validationAlert.setAttribute('hidden', '');
  }

  if (topicInput) {
    topicInput.focus();
  }
}

/* ============================================================================
   SETTINGS MANAGEMENT & PREFERENCES
   ============================================================================ */

/**
 * Initializes settings controls:
 * - API Key show/hide toggle, save, remove
 * - Appearance theme radio switches
 * - Study preferences persistence
 * - Data management controls
 */
function initializeSettings() {
  // 1. API Key Visibility Toggle
  const toggleKeyBtn = document.getElementById('btn-toggle-key-visibility');
  const apiKeyInput = document.getElementById('api-key-input');

  if (toggleKeyBtn && apiKeyInput) {
    toggleKeyBtn.addEventListener('click', () => {
      const isPassword = apiKeyInput.type === 'password';
      apiKeyInput.type = isPassword ? 'text' : 'password';

      const eyeShow = toggleKeyBtn.querySelector('.icon-eye-show');
      const eyeHide = toggleKeyBtn.querySelector('.icon-eye-hide');

      if (eyeShow && eyeHide) {
        if (isPassword) {
          eyeShow.setAttribute('hidden', '');
          eyeHide.removeAttribute('hidden');
          toggleKeyBtn.setAttribute('aria-label', 'Hide API key');
        } else {
          eyeShow.removeAttribute('hidden');
          eyeHide.setAttribute('hidden', '');
          toggleKeyBtn.setAttribute('aria-label', 'Show API key');
        }
      }
    });
  }

  // 2. API Key Save and Remove
  const saveKeyBtn = document.getElementById('btn-save-key');
  const removeKeyBtn = document.getElementById('btn-remove-key');

  if (saveKeyBtn) {
    saveKeyBtn.addEventListener('click', () => {
      const keyVal = apiKeyInput ? apiKeyInput.value.trim() : '';
      if (!keyVal) {
        showToast('Please enter an API key before saving', 'warning');
        return;
      }

      AppState.apiKey = keyVal;
      showModal({
        title: 'API Configuration Staged',
        message: 'Your Google Gemini API key has been registered in local application state. Active network requests and live validation will be enabled during Phase 3 integration.',
        confirmText: 'Acknowledge',
        showCancel: false,
        iconType: 'info'
      });
    });
  }

  if (removeKeyBtn) {
    removeKeyBtn.addEventListener('click', () => {
      if (!apiKeyInput || !apiKeyInput.value) {
        showToast('No API key entered to remove', 'info');
        return;
      }

      showModal({
        title: 'Remove API Key?',
        message: 'Are you sure you want to clear your staged API key from this browser session?',
        confirmText: 'Remove',
        cancelText: 'Cancel',
        isDanger: true,
        iconType: 'warning',
        onConfirm: () => {
          AppState.apiKey = '';
          if (apiKeyInput) apiKeyInput.value = '';
          showToast('API key removed from session', 'info');
        }
      });
    });
  }

  // 3. Appearance Radios
  const themeCardLight = document.getElementById('theme-card-light');
  const themeCardDark = document.getElementById('theme-card-dark');
  const lightRadio = document.getElementById('theme-radio-light');
  const darkRadio = document.getElementById('theme-radio-dark');

  if (themeCardLight && lightRadio) {
    themeCardLight.addEventListener('click', () => {
      applyTheme('light', true);
    });
  }

  if (themeCardDark && darkRadio) {
    themeCardDark.addEventListener('click', () => {
      applyTheme('dark', true);
    });
  }

  // 4. Study Preferences Form
  loadSavedPreferences();

  const prefsForm = document.getElementById('preferences-form');
  if (prefsForm) {
    prefsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveStudyPreferences();
    });
  }

  // 5. Data Management Action Buttons
  const clearHistoryBtn = document.getElementById('btn-data-clear-history');
  const resetProgressBtn = document.getElementById('btn-data-reset-progress');
  const resetPrefsBtn = document.getElementById('btn-data-reset-prefs');

  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      showToast('Study history tracking starts in Phase 4', 'info');
    });
  }

  if (resetProgressBtn) {
    resetProgressBtn.addEventListener('click', () => {
      showToast('Quiz progress tracking starts in Phase 4', 'info');
    });
  }

  if (resetPrefsBtn) {
    resetPrefsBtn.addEventListener('click', () => {
      showModal({
        title: 'Reset Preferences to Defaults?',
        message: 'This will reset your default quiz difficulty, summary style, flashcard animation, and theme back to default settings.',
        confirmText: 'Reset Defaults',
        cancelText: 'Cancel',
        isDanger: true,
        iconType: 'warning',
        onConfirm: () => {
          resetPreferencesToDefaults();
          showToast('Preferences reset to default values', 'info');
        }
      });
    });
  }
}

/**
 * Loads preferences from LocalStorage into the form inputs and state.
 */
function loadSavedPreferences() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        AppState.preferences = { ...AppState.preferences, ...parsed };
      }
    }
  } catch (err) {
    console.warn('Unable to read preferences from LocalStorage:', err);
  }

  // Populate form fields
  const diffSelect = document.getElementById('pref-default-difficulty');
  const styleSelect = document.getElementById('pref-default-summary-style');
  const animSelect = document.getElementById('pref-flashcard-animation');

  if (diffSelect) diffSelect.value = AppState.preferences.defaultDifficulty;
  if (styleSelect) styleSelect.value = AppState.preferences.defaultSummaryStyle;
  if (animSelect) animSelect.value = AppState.preferences.flashcardAnimation;

  // Sync with Dashboard radio defaults
  syncDashboardOptionDefaults();
}

/**
 * Synchronizes Dashboard options with loaded preferences.
 */
function syncDashboardOptionDefaults() {
  const diffRadio = document.querySelector(`input[name="difficulty"][value="${AppState.preferences.defaultDifficulty}"]`);
  if (diffRadio) diffRadio.checked = true;

  const styleRadio = document.querySelector(`input[name="summaryStyle"][value="${AppState.preferences.defaultSummaryStyle}"]`);
  if (styleRadio) styleRadio.checked = true;
}

/**
 * Saves study preferences from form into state and LocalStorage.
 */
function saveStudyPreferences() {
  const diffSelect = document.getElementById('pref-default-difficulty');
  const styleSelect = document.getElementById('pref-default-summary-style');
  const animSelect = document.getElementById('pref-flashcard-animation');

  if (diffSelect) AppState.preferences.defaultDifficulty = diffSelect.value;
  if (styleSelect) AppState.preferences.defaultSummaryStyle = styleSelect.value;
  if (animSelect) AppState.preferences.flashcardAnimation = animSelect.value;

  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(AppState.preferences));
    syncDashboardOptionDefaults();
    showToast('Preferences saved successfully', 'success');
  } catch (err) {
    console.warn('Unable to persist preferences to LocalStorage:', err);
    showToast('Could not save to LocalStorage', 'warning');
  }
}

/**
 * Resets application preferences and theme to factory defaults.
 */
function resetPreferencesToDefaults() {
  AppState.preferences = {
    defaultDifficulty: 'Medium',
    defaultSummaryStyle: 'Simple Explanation',
    flashcardAnimation: 'flip'
  };

  try {
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
    localStorage.removeItem(STORAGE_KEYS.THEME);
  } catch (err) {
    console.warn('Unable to clear LocalStorage:', err);
  }

  // Restore Light theme default
  applyTheme('light', false);

  // Reload preferences form
  loadSavedPreferences();
}

/* ============================================================================
   ACCESSIBLE MODAL DIALOG COMPONENT
   ============================================================================ */

let activeModalConfirmCallback = null;

/**
 * Initializes modal dialog listeners for close, cancel, and confirmation.
 */
function initializeConfirmationDialogs() {
  const modal = document.getElementById('app-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const cancelBtn = document.getElementById('modal-cancel-btn');
  const confirmBtn = document.getElementById('modal-confirm-btn');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (typeof activeModalConfirmCallback === 'function') {
        const callback = activeModalConfirmCallback;
        activeModalConfirmCallback = null;
        callback();
      }
      closeModal();
    });
  }

  // Close when clicking directly on backdrop
  if (modal) {
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeModal();
      }
    });

    // Close on Escape
    modal.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeModal();
    });
  }
}

/**
 * Displays the modal dialog with custom parameters.
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.message
 * @param {string} [options.confirmText='Confirm']
 * @param {string} [options.cancelText='Cancel']
 * @param {boolean} [options.showCancel=true]
 * @param {boolean} [options.isDanger=false]
 * @param {'info'|'warning'} [options.iconType='info']
 * @param {Function} [options.onConfirm=null]
 */
function showModal({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showCancel = true,
  isDanger = false,
  iconType = 'info',
  onConfirm = null
}) {
  const modal = document.getElementById('app-modal');
  const titleEl = document.getElementById('modal-title');
  const msgEl = document.getElementById('modal-message');
  const confirmBtn = document.getElementById('modal-confirm-btn');
  const cancelBtn = document.getElementById('modal-cancel-btn');
  const iconContainer = document.getElementById('modal-icon-container');

  if (!modal || !titleEl || !msgEl || !confirmBtn || !cancelBtn) return;

  titleEl.textContent = title;
  msgEl.textContent = message;

  confirmBtn.textContent = confirmText;
  confirmBtn.className = isDanger ? 'btn btn-danger' : 'btn btn-primary';

  if (showCancel) {
    cancelBtn.textContent = cancelText;
    cancelBtn.removeAttribute('hidden');
  } else {
    cancelBtn.setAttribute('hidden', '');
  }

  if (iconContainer) {
    if (iconType === 'warning') {
      iconContainer.style.color = 'var(--warning)';
    } else if (isDanger) {
      iconContainer.style.color = 'var(--danger)';
    } else {
      iconContainer.style.color = 'var(--primary)';
    }
  }

  activeModalConfirmCallback = onConfirm;

  if (typeof modal.showModal === 'function') {
    modal.showModal();
  } else {
    modal.setAttribute('open', '');
  }
}

/**
 * Closes the accessible modal dialog.
 */
function closeModal() {
  const modal = document.getElementById('app-modal');
  if (modal) {
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
  }
  activeModalConfirmCallback = null;
}

/* ============================================================================
   TOAST NOTIFICATION ENGINE
   ============================================================================ */

/**
 * Creates and displays an accessible toast notification.
 * @param {string} message - Notification text
 * @param {'info'|'success'|'warning'} [type='info'] - Severity variant
 * @param {number} [duration=3500] - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'status');

  // SVG Icon based on type
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>`;
  } else if (type === 'warning') {
    iconSvg = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>`;
  } else {
    iconSvg = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>`;
  }

  toast.innerHTML = `
    <span class="toast-icon">${iconSvg}</span>
    <span class="toast-text">${message}</span>
  `;

  container.appendChild(toast);

  // Auto-dismiss after duration
  const removeTimeout = setTimeout(() => {
    dismissToast(toast);
  }, duration);

  // Allow manual dismissal on click
  toast.addEventListener('click', () => {
    clearTimeout(removeTimeout);
    dismissToast(toast);
  });
}

/**
 * Dismisses a toast element with animation.
 * @param {HTMLElement} toast 
 */
function dismissToast(toast) {
  if (!toast || !toast.parentNode) return;
  toast.classList.add('toast-hiding');
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 200);
}

/* ============================================================================
   DOM READY EVENT DISPATCHER
   ============================================================================ */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

