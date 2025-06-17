const history = document.getElementById('history');
const commandInput = document.getElementById('commandInput');
const cursor = document.querySelector('.cursor');

const commands = {
    help: 'Display available commands',
    clear: 'Clear the terminal screen',
    whoami: 'Display current user information',
    history: 'Show command history',
    exit: 'Exit the terminal'
};

let commandHistory = [];
let historyIndex = -1;
let selectableElements = [];
let selectedIndex = -1;

function addToHistory(command, output, type = 'output') {
    const entry = document.createElement('div');
    entry.innerHTML = `<span class="prompt">user@localhost:~$</span> <span class="command">${command}</span>`;
    history.appendChild(entry);
    if (output) {
        const outputDiv = document.createElement('div');
        outputDiv.className = type;
        outputDiv.innerHTML = output;
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
            addToHistory(command, 'My name is Yan Georget. You can view my professional profile on https://www.linkedin.com/in/yangeorget.', 'success');
            break;

        case 'history':
            addToHistory(command, '');
            commandHistory.forEach((cmd, index) => {
                const histDiv = document.createElement('div');
                histDiv.innerHTML = `<span class="info">${(index + 1).toString().padStart(4)}</span>  ${cmd}`;
                history.appendChild(histDiv);
            });
            break;

        // case 'links':
        //     addToHistory(command, '');
        //     const linksDiv = document.createElement('div');
        //     linksDiv.innerHTML = '<span class="info">:</span>';
        //     linksDiv.style.marginBottom = '10px';
        //     history.appendChild(linksDiv);
        //
        //     availableLinks.forEach(link => {
        //         const linkDiv = document.createElement('div');
        //         linkDiv.className = 'link-item';
        //         linkDiv.innerHTML = `<span class="link-number">[${link.id}]</span>${link.name}`;
        //         linkDiv.onclick = () => window.open(link.url, '_blank');
        //         history.appendChild(linkDiv);
        //     });
        //
        //     setTimeout(() => {
        //         updateSelectableElements();
        //     }, 100);
        //     break;

        case 'exit':
            addToHistory(command, 'Goodbye!', 'warning');
            setTimeout(() => {
                window.close();
            }, 1000);
            break;

        default:
            if (cmd === '') {
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