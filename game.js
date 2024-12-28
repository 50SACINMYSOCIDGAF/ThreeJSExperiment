class HackingGame {
    constructor() {
        console.log("Initializing HackingGame");
        this.currentStage = 0;
        this.stages = ['network', 'password', 'override'];
        this.resetGameState();
        this.setupGame();
    }

    resetGameState() {
        console.log("Resetting game state");
        // Network stage state
        this.networkSequence = [];
        this.networkTarget = 4; // Need to connect 4 nodes
        this.correctNodes = [];

        // Password stage state
        this.passwordSequence = [];
        this.playerSequence = [];
        this.sequenceLength = 5;
        this.isShowingSequence = false;

        // Override stage state
        this.commands = [
            'ACCESS_MAINFRAME',
            'BYPASS_SECURITY',
            'DECRYPT_FILES',
            'UPLOAD_VIRUS',
            'EXECUTE_PAYLOAD'
        ];
        this.currentCommand = 0;
        this.commandTimeout = null;
    }

    setupGame() {
        console.log("Setting up game");
        // Remove any existing modal
        const existingModal = document.querySelector('.game-modal');
        if (existingModal) {
            existingModal.remove();
        }

        this.modal = document.createElement('div');
        this.modal.className = 'game-modal';
        this.modal.innerHTML = `
            <div class="game-titlebar">
                <div class="game-title">
                    <span>MAINFRAME.EXE</span>
                </div>
                <div class="game-close">×</div>
            </div>
            <div class="game-content">
                <div id="network-stage" class="game-stage"></div>
                <div id="password-stage" class="game-stage"></div>
                <div id="override-stage" class="game-stage"></div>
            </div>
            <div class="status-bar">
                <span class="stage-indicator">Stage 1: Network Access</span>
            </div>
        `;
        document.body.appendChild(this.modal);
        console.log("Game modal created");

        this.setupEventListeners();
        this.initializeStages();
    }

    setupEventListeners() {
        const closeBtn = this.modal.querySelector('.game-close');
        closeBtn.addEventListener('click', () => this.hideGame());

        document.addEventListener('keydown', (e) => {
            if (this.currentStage === 2) {
                this.handleTerminalInput(e);
            }
        });
    }

    showGame() {
        console.log("Showing game");
        this.modal.classList.add('active');
        this.showStage(0);
    }

    hideGame() {
        console.log("Hiding game");
        this.modal.classList.remove('active');
    }

    showStage(stageIndex) {
        console.log("Showing stage:", stageIndex);
        const stages = document.querySelectorAll('.game-stage');
        stages.forEach(stage => stage.classList.remove('active'));

        const currentStage = document.getElementById(`${this.stages[stageIndex]}-stage`);
        if (currentStage) {
            currentStage.classList.add('active');
            const stageNames = [
                'Network Access',
                'Password Cracker',
                'System Override'
            ];

            const indicator = this.modal.querySelector('.stage-indicator');
            if (indicator) {
                indicator.textContent = `Stage ${stageIndex + 1}: ${stageNames[stageIndex]}`;
            }

            if (stageIndex === 1) {
                setTimeout(() => this.showPasswordSequence(), 1000);
            } else if (stageIndex === 2) {
                this.startCommandSequence();
            }
        } else {
            console.error("Stage element not found:", this.stages[stageIndex]);
        }
    }

    // Part 2: Network Stage Methods
    initializeStages() {
        console.log("Initializing stages");
        this.initNetworkStage();
        this.initPasswordStage();
        this.initOverrideStage();
    }

    initNetworkStage() {
        console.log("Initializing network stage");
        const networkStage = document.getElementById('network-stage');
        if (!networkStage) {
            console.error("Network stage element not found");
            return;
        }

        networkStage.innerHTML = `
            <div class="stage-header">Connect secure nodes to access the network</div>
            <div class="network-grid"></div>
            <div class="stage-info">Nodes required: 0/${this.networkTarget}</div>
        `;

        const grid = networkStage.querySelector('.network-grid');
        if (!grid) {
            console.error("Network grid not found");
            return;
        }

        for (let i = 0; i < 15; i++) {
            const node = document.createElement('div');
            node.className = 'network-node';
            node.dataset.index = i;
            node.innerHTML = `
                <div>NODE_${i + 1}</div>
                <div>192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}</div>
            `;
            node.addEventListener('click', () => this.handleNodeClick(node));
            grid.appendChild(node);
        }
    }

    handleNodeClick(node) {
        if (this.correctNodes.includes(node.dataset.index)) return;

        node.classList.add('active');
        this.networkSequence.push(node.dataset.index);
        this.correctNodes.push(node.dataset.index);

        const info = document.querySelector('.stage-info');
        info.textContent = `Nodes required: ${this.correctNodes.length}/${this.networkTarget}`;

        if (this.correctNodes.length > 1) {
            this.drawNodeConnection(
                document.querySelector(`[data-index="${this.correctNodes[this.correctNodes.length - 2]}"]`),
                node
            );
        }

        if (this.correctNodes.length === this.networkTarget) {
            setTimeout(() => {
                this.showSuccessMessage('Network access granted!');
                this.currentStage++;
                this.showStage(this.currentStage);
            }, 1000);
        }
    }

    drawNodeConnection(node1, node2) {
        const rect1 = node1.getBoundingClientRect();
        const rect2 = node2.getBoundingClientRect();

        const line = document.createElement('div');
        line.className = 'network-connection';

        // Calculate the line position and rotation
        const x1 = rect1.left + rect1.width / 2;
        const y1 = rect1.top + rect1.height / 2;
        const x2 = rect2.left + rect2.width / 2;
        const y2 = rect2.top + rect2.height / 2;

        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

        line.style.width = `${length}px`;
        line.style.left = `${x1}px`;
        line.style.top = `${y1}px`;
        line.style.transform = `rotate(${angle}deg)`;

        document.querySelector('.network-grid').appendChild(line);
    }

    // Part 3: Password Stage Methods
    initPasswordStage() {
        console.log("Initializing password stage");
        const passwordStage = document.getElementById('password-stage');
        if (!passwordStage) {
            console.error("Password stage element not found");
            return;
        }

        passwordStage.innerHTML = `
            <div class="stage-header">Memorize and repeat the sequence</div>
            <div class="hex-grid"></div>
            <div class="stage-info">Watch carefully...</div>
        `;

        const grid = passwordStage.querySelector('.hex-grid');
        if (!grid) {
            console.error("Hex grid not found");
            return;
        }

        for (let i = 0; i < 32; i++) {
            const cell = document.createElement('div');
            cell.className = 'hex-cell';
            cell.dataset.index = i;
            cell.textContent = this.generateHexValue();
            cell.addEventListener('click', () => this.handleHexClick(cell));
            grid.appendChild(cell);
        }

        this.generatePasswordSequence();
    }

    generateHexValue() {
        return Math.floor(Math.random() * 256)
            .toString(16)
            .padStart(2, '0')
            .toUpperCase();
    }

    generatePasswordSequence() {
        this.passwordSequence = [];
        for (let i = 0; i < this.sequenceLength; i++) {
            this.passwordSequence.push(Math.floor(Math.random() * 32));
        }
    }

    showPasswordSequence() {
        if (!this.modal.classList.contains('active')) return;

        const info = document.querySelector('.stage-info');
        if (!info) return;

        info.textContent = 'Memorize the sequence...';
        this.isShowingSequence = true;
        this.playerSequence = [];

        this.passwordSequence.forEach((index, i) => {
            setTimeout(() => {
                const cell = document.querySelector(`[data-index="${index}"]`);
                if (cell) {
                    cell.classList.add('flash');
                    setTimeout(() => cell.classList.remove('flash'), 500);
                }

                if (i === this.passwordSequence.length - 1) {
                    setTimeout(() => {
                        if (info) info.textContent = 'Repeat the sequence';
                        this.isShowingSequence = false;
                    }, 500);
                }
            }, i * 1000);
        });
    }

    handleHexClick(cell) {
        if (this.isShowingSequence) return;

        cell.classList.add('flash');
        setTimeout(() => cell.classList.remove('flash'), 500);

        this.playerSequence.push(parseInt(cell.dataset.index));

        if (this.playerSequence[this.playerSequence.length - 1] !==
            this.passwordSequence[this.playerSequence.length - 1]) {
            this.showErrorMessage('Wrong sequence! Try again.');
            this.playerSequence = [];
            setTimeout(() => this.showPasswordSequence(), 1000);
            return;
        }

        if (this.playerSequence.length === this.passwordSequence.length) {
            this.showSuccessMessage('Password cracked!');
            this.currentStage++;
            setTimeout(() => this.showStage(this.currentStage), 1000);
        }
    }

    // Part 4: Override Stage Methods
    initOverrideStage() {
        console.log("Initializing override stage");
        const overrideStage = document.getElementById('override-stage');
        if (!overrideStage) {
            console.error("Override stage element not found");
            return;
        }

        overrideStage.innerHTML = `
            <div class="terminal">
                <div class="terminal-output">
                    MAINFRAME ACCESS TERMINAL v1.0
                    --------------------------------
                    AWAITING SYSTEM OVERRIDE SEQUENCE
                </div>
                <div class="command-prompt">
                    <span class="prompt">&gt;</span>
                    <input type="text" class="command-input" autocomplete="off">
                </div>
            </div>
        `;

        const input = overrideStage.querySelector('.command-input');
        if (input) {
            input.addEventListener('keydown', (e) => this.handleTerminalInput(e));
        }

        this.startCommandSequence();
    }

    startCommandSequence() {
        if (!this.modal.classList.contains('active')) return;

        const output = document.querySelector('.terminal-output');
        if (!output) return;

        output.innerHTML += '\n\nRequired command: ' + this.commands[this.currentCommand];

        clearTimeout(this.commandTimeout);
        this.commandTimeout = setTimeout(() => {
            this.showErrorMessage('Command timeout! Security protocols reset.');
            this.currentCommand = 0;
            this.startCommandSequence();
        }, 10000);
    }

    handleTerminalInput(e) {
        if (e.key !== 'Enter') return;

        const input = document.querySelector('.command-input');
        const output = document.querySelector('.terminal-output');
        if (!input || !output) return;

        const command = input.value.trim().toUpperCase();
        output.innerHTML += `\n> ${command}`;
        input.value = '';

        clearTimeout(this.commandTimeout);

        if (command === this.commands[this.currentCommand]) {
            this.currentCommand++;
            output.innerHTML += '\nCommand accepted.';

            if (this.currentCommand === this.commands.length) {
                this.showSuccessMessage('System successfully compromised!');
                setTimeout(() => this.completeGame(), 2000);
                return;
            }

            output.innerHTML += '\n\nRequired command: ' + this.commands[this.currentCommand];
            this.startCommandSequence();
        } else {
            this.showErrorMessage('Invalid command! Security protocols reset.');
            this.currentCommand = 0;
            setTimeout(() => this.startCommandSequence(), 1000);
        }
    }

    // Utility Methods
    showSuccessMessage(message) {
        console.log("Success:", message);
        const modal = document.createElement('div');
        modal.className = 'success-message';
        modal.textContent = message;
        document.body.appendChild(modal);
        setTimeout(() => modal.remove(), 2000);
    }

    showErrorMessage(message) {
        console.log("Error:", message);
        const modal = document.createElement('div');
        modal.className = 'error-message';
        modal.textContent = message;
        document.body.appendChild(modal);
        setTimeout(() => modal.remove(), 2000);
    }

    completeGame() {
        this.showSuccessMessage('Congratulations! Mainframe hacked!');
        setTimeout(() => {
            this.hideGame();
            this.resetGameState();
        }, 2000);
    }
}

// Initialize the game when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing game instance");
    window.hackingGame = new HackingGame();
});
