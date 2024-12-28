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

// Settings Panel Manager
class SettingsManager {
    constructor() {
        this.overlay = document.getElementById('settings-overlay');
        this.bindEvents();
    }

    toggleSettings() {
        this.overlay.classList.toggle('active');
    }

    bindEvents() {
        // Settings button
        document.getElementById('settings-button')
            .addEventListener('click', () => this.toggleSettings());

        // Close button
        document.getElementById('close-settings')
            .addEventListener('click', () => this.toggleSettings());

        // Click outside to close
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.toggleSettings();
            }
        });

        // Hover effects for corner buttons
        document.querySelectorAll('.corner-button').forEach(button => {
            button.addEventListener('mousemove', e => {
                const rect = button.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / button.clientWidth) * 100;
                const y = ((e.clientY - rect.top) / button.clientHeight) * 100;
                button.style.setProperty('--x', `${x}%`);
                button.style.setProperty('--y', `${y}%`);
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new SettingsManager();
});