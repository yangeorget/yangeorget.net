const history = document.getElementById('history');
const commandInput = document.getElementById('commandInput');
const cursor = document.querySelector('.cursor');

const commands = {
    help: 'Display available commands',
    clear: 'Clear the terminal screen',
    whoami: 'Display current user information',
    date: 'Display current date and time',
    pwd: 'Print working directory',
    ls: 'List directory contents',
    cat: 'Display file contents',
    echo: 'Display a line of text',
    uname: 'Display system information',
    uptime: 'Show system uptime',
    ps: 'Display running processes',
    history: 'Show command history',
    links: 'Show available links',
    open: 'Open a link by number (e.g., open 1)',
    exit: 'Exit the terminal'
};

const availableLinks = [
    { name: 'GitHub Profile', url: 'https://github.com', id: 1 },
    { name: 'LinkedIn', url: 'https://linkedin.com', id: 2 },
    { name: 'Personal Website', url: 'https://example.com', id: 3 },
    { name: 'Email Contact', url: 'mailto:contact@example.com', id: 4 }
];

let commandHistory = [];
let historyIndex = -1;
let selectableElements = [];
let selectedIndex = -1;

function addToHistory(command, output, type = 'output') {
    const entry = document.createElement('div');
    entry.innerHTML = `<span class="prompt">user@terminal:~$</span> <span class="command">${command}</span>`;
    history.appendChild(entry);

    if (output) {
        const outputDiv = document.createElement('div');
        outputDiv.className = type;
        outputDiv.textContent = output;
        history.appendChild(outputDiv);
    }
}

function updateSelectableElements() {
    selectableElements = Array.from(document.querySelectorAll('.link-item'));
    selectedIndex = -1;
    selectableElements.forEach(el => el.classList.remove('selected'));
}

function selectNext() {
    if (selectableElements.length === 0) return;

    if (selectedIndex >= 0) {
        selectableElements[selectedIndex].classList.remove('selected');
    }

    selectedIndex = (selectedIndex + 1) % selectableElements.length;
    selectableElements[selectedIndex].classList.add('selected');
    selectableElements[selectedIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function selectPrevious() {
    if (selectableElements.length === 0) return;

    if (selectedIndex >= 0) {
        selectableElements[selectedIndex].classList.remove('selected');
    }

    selectedIndex = selectedIndex <= 0 ? selectableElements.length - 1 : selectedIndex - 1;
    selectableElements[selectedIndex].classList.add('selected');
    selectableElements[selectedIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function activateSelected() {
    if (selectedIndex >= 0 && selectableElements[selectedIndex]) {
        selectableElements[selectedIndex].click();
    }
}

function executeCommand(command) {
    const cmd = command.trim().toLowerCase();
    const args = command.trim().split(' ');

    commandHistory.push(command);
    historyIndex = commandHistory.length;

    switch(cmd) {
        case 'help':
            addToHistory(command, '');
            const helpDiv = document.createElement('div');
            helpDiv.innerHTML = '<span class="info">Available commands:</span>';
            helpDiv.style.marginBottom = '10px';
            history.appendChild(helpDiv);

            Object.entries(commands).forEach(([cmd, desc]) => {
                const cmdDiv = document.createElement('div');
                cmdDiv.innerHTML = `<span class="success">${cmd.padEnd(12)}</span> <span style="color: var(--base01)">-</span> ${desc}`;
                cmdDiv.style.padding = '2px 10px';
                history.appendChild(cmdDiv);
            });
            break;

        case 'clear':
            history.innerHTML = '';
            return;

        case 'whoami':
            addToHistory(command, 'yan', 'success');
            break;

        case 'date':
            addToHistory(command, new Date().toString(), 'info');
            break;

        case 'pwd':
            addToHistory(command, '/home/yan', 'info');
            break;

        case 'ls':
            addToHistory(command, 'Documents  Downloads  Pictures  Projects  README.txt', 'info');
            break;

        case 'uname':
            addToHistory(command, 'Linux terminal 5.4.0 #1 SMP x86_64 GNU/Linux', 'info');
            break;

        case 'uptime':
            addToHistory(command, 'up 42 days, 13:37, 1 user, load average: 0.15, 0.10, 0.05', 'info');
            break;

        case 'ps':
            addToHistory(command, 'PID  TTY     TIME     CMD\n1234 pts/0   00:00:01 bash\n5678 pts/0   00:00:00 ps', 'info');
            break;

        case 'history':
            addToHistory(command, '');
            commandHistory.forEach((cmd, index) => {
                const histDiv = document.createElement('div');
                histDiv.innerHTML = `<span class="info">${(index + 1).toString().padStart(4)}</span>  ${cmd}`;
                history.appendChild(histDiv);
            });
            break;

        case 'links':
            addToHistory(command, '');
            const linksDiv = document.createElement('div');
            linksDiv.innerHTML = '<span class="info">Available links (use Tab/Shift+Tab to navigate, Enter to open):</span>';
            linksDiv.style.marginBottom = '10px';
            history.appendChild(linksDiv);

            availableLinks.forEach(link => {
                const linkDiv = document.createElement('div');
                linkDiv.className = 'link-item';
                linkDiv.innerHTML = `<span class="link-number">[${link.id}]</span>${link.name}`;
                linkDiv.onclick = () => window.open(link.url, '_blank');
                history.appendChild(linkDiv);
            });

            setTimeout(() => {
                updateSelectableElements();
            }, 100);
            break;

        case 'exit':
            addToHistory(command, 'Goodbye!', 'warning');
            setTimeout(() => {
                window.close();
            }, 1000);
            break;

        default:
            if (cmd.startsWith('open ')) {
                const linkId = parseInt(args[1]);
                const targetLink = availableLinks.find(link => link.id === linkId);
                if (targetLink) {
                    addToHistory(command, `Opening ${targetLink.name}...`, 'success');
                    setTimeout(() => window.open(targetLink.url, '_blank'), 500);
                } else {
                    addToHistory(command, `Link ${linkId} not found. Use 'links' to see available links.`, 'error');
                }
            } else if (cmd.startsWith('echo ')) {
                const text = command.substring(5);
                addToHistory(command, text, 'info');
            } else if (cmd.startsWith('cat ')) {
                const filename = args[1];
                if (filename === 'README.txt') {
                    addToHistory(command, 'This is Yan Georget\'s terminal interface.\nWelcome to my digital workspace!', 'info');
                } else {
                    addToHistory(command, `cat: ${filename}: No such file or directory`, 'error');
                }
            } else if (cmd === '') {
                addToHistory('', '');
            } else {
                addToHistory(command, `bash: ${cmd}: command not found`, 'error');
            }
            break;
    }

    // Scroll to bottom
    history.scrollTop = history.scrollHeight;
}

commandInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        // If a link is selected, activate it instead of executing command
        if (selectedIndex >= 0) {
            e.preventDefault();
            activateSelected();
            return;
        }
        // Otherwise execute the command normally
        const command = commandInput.value;
        executeCommand(command);
        commandInput.value = '';
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            commandInput.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            commandInput.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            commandInput.value = '';
        }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        if (e.shiftKey) {
            selectPrevious();
        } else {
            selectNext();
        }
    } else if (e.key === 'Escape') {
        // Clear selection with Escape key
        if (selectedIndex >= 0) {
            selectableElements[selectedIndex].classList.remove('selected');
            selectedIndex = -1;
        }
    }
});

// Keep focus on input
document.addEventListener('click', () => {
    commandInput.focus();
});

// Hide cursor when input is not focused
commandInput.addEventListener('focus', () => {
    cursor.style.display = 'inline-block';
});

commandInput.addEventListener('blur', () => {
    cursor.style.display = 'none';
});