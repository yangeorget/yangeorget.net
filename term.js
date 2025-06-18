let commandHistory = [];
let historyIndex = -1;

const commands = {
    help: () => {
        return [
            'Available commands:',
            '  cat        - Display file contents',
            '  clear      - Clear the terminal screen',
            '  date       - Display current date and time',
            '  echo       - Display text',
            '  fortune    - Display a random fortune',
            '  github     - Open GitHub in a new tab',
            '  help       - Show this help message',
            '  history    - Show command history',
            '  linkedin   - Open LinkedIn in a new tab',
            '  ls         - List directory contents',
            '  pwd        - Print working directory',
            '  whoami     - Print current username'
        ];
    },
    date: () => {
        const now = new Date();
        return [now.toString()];
    },
    github: () => {
        window.open('https://github.com/yangeorget', '_blank');
        return [];
    },
    linkedin: () => {
        window.open('https://www.linkedin.com/in/yangeorget', '_blank');
        return [];
    },
    whoami: () => {
        return ["guest"];
    },
    pwd: () => {
        return ["/home/yangeorget/pub"];
    },
    ls: (args) => {
        return ["README.txt"];
    },
    cat: (args) => {
        if (!args[0]) {
            return ['cat: Missing file operand'];
        }
        const filename = args[0];
        if (filename === 'README.txt') {
            return [
                'About me',
                '--------',
                'I am a graduate from the French Ecole Polytechnique and have a PhD in Computer Science (Constraint Programming).',
                'I am an experienced CTO who has worked in various environments, from startups to large companies.',
                'You can find my resume on LinkedIn: https://www.linkedin.com/in/yangeorget/.',
                ' ',
                'About this website',
                '------------------',
                'This website mimics an old unix terminal.',
                'The code is available on GitHub: https://github.com/yangeorget/yangeorget.net.',
            ];
        }
        return [`cat: ${filename}: No such file or directory`];
    },
    history: () => {
        if (commandHistory.length === 0) {
            return [];
        }
        const output = [];
        commandHistory.slice(-20).forEach((cmd, i) => {
            output.push(`  ${(i + 1).toString().padStart(3)}: ${cmd}`);
        });
        return output;
    },
    echo: (args) => {
        return [args.join(' ')];
    },
    banner: () => {
        return [
            ' ',
            '██╗   ██╗ █████╗ ███╗   ██╗     ██████╗ ███████╗ ██████╗ ██████╗  ██████╗ ███████╗████████╗',
            '╚██╗ ██╔╝██╔══██╗████╗  ██║    ██╔════╝ ██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝╚══██╔══╝',
            ' ╚████╔╝ ███████║██╔██╗ ██║    ██║  ███╗█████╗  ██║   ██║██████╔╝██║  ███╗█████╗     ██║',
            '  ╚██╔╝  ██╔══██║██║╚██╗██║    ██║   ██║██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝     ██║',
            '   ██║   ██║  ██║██║ ╚████║    ╚██████╔╝███████╗╚██████╔╝██║  ██║╚██████╔╝███████╗   ██║',
            '   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝     ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝',
            ' ',
            'Type "help" for a list of commands.',
            ' '
        ];
    },
    fortune: () => {
        const fortunes = [
            "For most people, life is like a henhouse ladder: shitty and short.",
            "I would tell you a joke about UDP, but you might not get it.",
            "Talk is cheap. Show me the code.",
            "The best way to predict the future is to invent it.",
            "There are 10 types of people in the world: those who understand binary and those who don’t.",
            "There are only two hard things in Computer Science: cache invalidation and naming things."
        ];
        return [fortunes[Math.floor(Math.random() * fortunes.length)]];
    }
};

function setupTerminal(){
    document.getElementById('terminal').innerHTML = createPromptDiv();
    const input = document.getElementById('command-input');
    input.addEventListener('keydown', handleKeyDown);
    input.focus();
    return null;
}

function handleKeyDown(e) {
    const input = e.target;
    if (e.key === 'Enter') {
        const command = input.value.trim();
        executeCommand(command);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
        } else if (historyIndex === commandHistory.length - 1) {
            historyIndex = commandHistory.length;
            input.value = '';
        }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        // Simple tab completion for commands
        const partial = input.value.toLowerCase();
        const matches = Object.keys(commands).filter(cmd => cmd.startsWith(partial));
        if (matches.length === 1) {
            input.value = matches[0];
        }
    }
}

function createPromptInput() {
    return `<input type="text" class="terminal-input" id="command-input" autocomplete="off" autofocus>`
}
function createPromptSpan(html) {
    return `<span class="prompt-user">guest</span><span class="header">@</span><span class="prompt-host">localhost</span><span class="header">:</span><span class="prompt-path">/home/yangeorget/pub</span><span class="header">$ </span>${html}`;
}
function createPromptDiv() {
    return `<div class="input-line">${createPromptSpan(createPromptInput())}</div>`;
}

function executeCommand(commandLine) {
    if (commandLine) {
        commandHistory.push(commandLine);
        if (commandHistory.length > 100) commandHistory.shift();
        historyIndex = commandHistory.length;
        const terminal = document.getElementById('terminal');
        const inputLine = terminal.querySelector('.input-line');
        // Add the command to terminal history
        const commandDiv = document.createElement('div');
        commandDiv.className = 'terminal-line';
        commandDiv.innerHTML = createPromptSpan(commandLine);
        terminal.insertBefore(commandDiv, inputLine);
        // Parse command and arguments
        const parts = commandLine.split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);
        // Execute command
        if (cmd === 'clear') {
            setupTerminal()
            return;
        }
        let output = null;
        if (commands[cmd]) {
            output = commands[cmd](args)
        } else {
            output = [`bash: ${cmd}: command not found`];
        }
        // Display output
        if (output && output.length > 0) {
            output.forEach(line => {
                const outputDiv = document.createElement('div');
                outputDiv.className = 'terminal-line';
                if (line.includes('error') || line.includes('No such file')) {
                    outputDiv.classList.add('error');
                }
                outputDiv.innerHTML = line;
                terminal.insertBefore(outputDiv, inputLine);
            });
        }
        // Reset input and update prompt
        document.getElementById('command-input').value = '';
        // Scroll to bottom
        terminal.scrollTop = terminal.scrollHeight;
    }
}

// Keep focus on input
document.addEventListener('click', () => {
    const input = document.getElementById('command-input');
    if (input) input.focus();
});
