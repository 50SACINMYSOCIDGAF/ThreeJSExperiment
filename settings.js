// Theme Management
class ThemeManager {
    constructor() {
        this.defaultTheme = 'cyan-gold';
        this.initializeTheme();
        this.bindEvents();
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || this.defaultTheme;
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateThemeUI(theme);
    }

    updateThemeUI(currentTheme) {
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.toggle('active', option.dataset.theme === currentTheme);
        });
    }

    bindEvents() {
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                this.setTheme(option.dataset.theme);
            });
        });
    }
}

class SettingsManager {
    constructor() {
        this.overlay = document.getElementById('settings-overlay');
        this.holdTimer = null;
        this.holdDuration = 2000;
        this.wasLongPress = false;
        this.hackingGame = null;  // Initialize as null
        this.bindEvents();
        this.initializeGame();
    }

    initializeGame() {
        this.hackingGame = new HackingGame();  // Create instance
    }

    bindEvents() {
        const settingsButton = document.getElementById('settings-button');

        // Use arrow functions to maintain 'this' context
        settingsButton.addEventListener('click', (e) => {
            if (!this.wasLongPress) {
                this.toggleSettings();
            }
            this.wasLongPress = false;
        });

        settingsButton.addEventListener('mousedown', () => {
            this.wasLongPress = false;
            this.holdTimer = setTimeout(() => {
                this.wasLongPress = true;
                if (this.hackingGame) {  // Check if game exists
                    this.toggleSettings(); // Close settings if open
                    this.hackingGame.showGame();
                }
            }, this.holdDuration);
        });

        const clearTimer = () => {
            if (this.holdTimer) {
                clearTimeout(this.holdTimer);
                this.holdTimer = null;
            }
        };

        settingsButton.addEventListener('mouseup', clearTimer);
        settingsButton.addEventListener('mouseleave', clearTimer);

        document.getElementById('close-settings')
            .addEventListener('click', () => this.toggleSettings());

        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.toggleSettings();
            }
        });
    }

    toggleSettings() {
        this.overlay.classList.toggle('active');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new SettingsManager();
});