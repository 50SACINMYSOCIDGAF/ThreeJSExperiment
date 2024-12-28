// Tab Manager
class TabManager {
    constructor() {
        this.initializeTabs();
        this.bindTabEvents();
    }

    initializeTabs() {
        document.querySelectorAll('#about, #contact').forEach(section => {
            section.style.display = 'none';
        });

        document.getElementById('projects').style.display = 'block';
        document.querySelector('.language-filters').style.display = 'flex';

        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === 'projects');
        });
    }

    bindTabEvents() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => this.handleTabClick(tab));
        });
    }

    handleTabClick(selectedTab) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        selectedTab.classList.add('active');

        document.querySelectorAll('#projects, #about, #contact').forEach(section => {
            section.style.display = 'none';
        });

        const tabName = selectedTab.getAttribute('data-tab');
        document.querySelector('.language-filters').style.display =
            tabName === 'projects' ? 'flex' : 'none';
        document.getElementById(tabName).style.display = 'block';
    }
}

// UI Effects Manager
class UIEffectsManager {
    constructor() {
        this.bindHoverEffects();
        this.initializeTypewriter();
    }

    bindHoverEffects() {
        document.querySelectorAll('.tab, .language-filter, .corner-button').forEach(button => {
            button.addEventListener('mousemove', e => this.handleButtonHover(e, button));
        });
    }

    handleButtonHover(e, button) {
        const rect = button.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / button.clientWidth) * 100;
        const y = ((e.clientY - rect.top) / button.clientHeight) * 100;
        button.style.setProperty('--x', `${x}%`);
        button.style.setProperty('--y', `${y}%`);
    }

    initializeTypewriter() {
        const title = document.getElementById('hi-im-noah-r');
        if (title) {
            title.addEventListener('animationend', (e) => {
                if (e.animationName === 'typing') {
                    title.classList.add('finished');
                }
            });
        }
    }
}

// Project Filter Manager
class ProjectFilterManager {
    constructor() {
        this.bindFilterEvents();
    }

    bindFilterEvents() {
        const languageFilters = document.querySelectorAll('.language-filter');
        const projectCards = document.querySelectorAll('.project-card');

        languageFilters.forEach(filter => {
            filter.addEventListener('click', () => this.handleFilterClick(filter, languageFilters, projectCards));
        });
    }

    handleFilterClick(selectedFilter, allFilters, projectCards) {
        allFilters.forEach(f => f.classList.remove('active'));
        selectedFilter.classList.add('active');

        const selectedLanguage = selectedFilter.getAttribute('data-language');
        this.filterProjects(projectCards, selectedLanguage);
    }

    filterProjects(projectCards, selectedLanguage) {
        projectCards.forEach(card => {
            const projectLanguages = card.getAttribute('data-languages')?.split(',') || [];
            const shouldShow = selectedLanguage === 'all' || projectLanguages.includes(selectedLanguage);

            if (shouldShow) {
                card.style.display = 'block';
                card.style.opacity = '0';
                setTimeout(() => card.style.opacity = '1', 50);
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Background Animation Manager
class BackgroundManager {
    constructor() {
        this.isTouch = false;
        this.globalMouseX = 0;
        this.globalMouseY = 0;
        this.viewportMouseY = 0;
        this.targetColor = new THREE.Color(0x98F595);
        this.initializeScene();
        this.bindEvents();
        this.animate();
    }

    initializeScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('background-canvas'),
            alpha: true
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        const geometry = new THREE.BufferGeometry();
        const particles = 2000;
        const positions = new Float32Array(particles * 3);

        for(let i = 0; i < particles * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 10;
            positions[i + 1] = (Math.random() - 0.5) * 10;
            positions[i + 2] = (Math.random() - 0.5) * 10;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.material = new THREE.PointsMaterial({
            color: 0x98F595,
            size: 0.02
        });

        this.points = new THREE.Points(geometry, this.material);
        this.scene.add(this.points);
        this.camera.position.z = 5;
    }

    getColoredElements() {
        const coloredElements = [
            ...document.querySelectorAll('[class^="color-"]'),
            ...document.querySelectorAll('.language-tag')
        ];

        return Array.from(coloredElements).map(el => ({
            element: el,
            rect: el.getBoundingClientRect(),
            color: window.getComputedStyle(el).color
        }));
    }

    rgbToHex(rgb) {
        const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!match) return 0x98F595;

        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);

        return (r << 16) | (g << 8) | b;
    }

    updateParticleColor(event) {
        if (this.isTouch) return;

        if (event.clientX !== undefined) {
            this.globalMouseX = event.clientX;
            this.viewportMouseY = event.clientY;
            this.globalMouseY = this.viewportMouseY + window.scrollY;
        }

        const elements = this.getColoredElements();
        let closestDist = Infinity;
        let closestColor = 0x98F595;

        elements.forEach(({element, rect, color}) => {
            const elementX = rect.left + rect.width/2;
            const elementViewportY = rect.top + rect.height/2;

            const dist = Math.sqrt(
                Math.pow(this.globalMouseX - elementX, 2) +
                Math.pow(this.viewportMouseY - elementViewportY, 2)
            );

            if (dist < closestDist) {
                closestDist = dist;
                closestColor = this.rgbToHex(color);
            }
        });

        this.targetColor = new THREE.Color(closestColor);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.material.color.lerp(this.targetColor, 0.1);
        this.points.rotation.x += 0.001;
        this.points.rotation.y += 0.001;
        this.renderer.render(this.scene, this.camera);
    }

    bindEvents() {
        window.addEventListener('touchstart', () => {
            this.isTouch = true;
            this.targetColor = new THREE.Color(0x98F595);
        }, { once: true });

        window.addEventListener('mousemove', (e) => {
            this.globalMouseX = e.clientX;
            this.viewportMouseY = e.clientY;
            this.globalMouseY = this.viewportMouseY + window.scrollY;
            this.updateParticleColor(e);
        });

        window.addEventListener('scroll', () => {
            if (!this.isTouch) {
                this.updateParticleColor({
                    clientX: this.globalMouseX,
                    clientY: this.viewportMouseY
                });
            }
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TabManager();
    new UIEffectsManager();
    new ProjectFilterManager();
    new BackgroundManager();
});