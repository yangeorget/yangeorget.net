let commandHistory = [];
let historyIndex = -1;

const commands = {
    help: help_command,
    banner: banner_command,
    cat: cat_command,
    date: date_command,
    echo: echo_command,
    fortune: fortune_command,
    github: github_command,
    history: history_command,
    linkedin: linkedin_command,
    ls: ls_command,
    picture: picture_command,
    pwd: pwd_command,
    whoami: whoami_command
};

function setupTerminal(){
    document.getElementById('terminal').innerHTML = `<div class="input-line"><span class="prompt-user">guest</span><span class="header">@</span><span class="prompt-host">localhost</span><span class="header">:</span><span class="prompt-path">/home/yangeorget/pub</span><span class="header">$ </span><input type="text" class="terminal-input" id="command-input" autocomplete="off"></div>`;
    const input = document.getElementById('command-input');
    input.addEventListener('keydown', handleKeyDown);
    input.focus();
    return null;
}

async function showMovie(args) {
    const width = args[0] ? args[0] : 112;
    const height = args[1] ? args[1] : 56;
    document.getElementById('terminal').innerHTML = `<video id="videoFeed" autoplay playsinline></video><div id="asciiArt"></div>`;
    const videoFeed = document.getElementById('videoFeed');
    const canvas = document.getElementById('canvas');
    canvas.width = width;
    canvas.height = height;
    const asciiArtDiv = document.getElementById('asciiArt');
    const context = canvas.getContext('2d', {willReadFrequently: true});
    let stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
    videoFeed.srcObject = stream;
    let intervalId = setInterval(
        function () {
            if (videoFeed.readyState === videoFeed.HAVE_ENOUGH_DATA) {
                context.drawImage(videoFeed, 0 , 0, width, height);
                const asciiArt = processImage(context, width, height);
                asciiArtDiv.innerHTML = asciiArt.join("<BR>");
            }
            },
        200
    );
    document.addEventListener('keydown', () => {
        stream.getTracks().forEach(track => track.stop());
        clearInterval(intervalId);
        setupTerminal();
    }, {once: true});
    return null;
}

async function handleKeyDown(e) {
    const input = e.target;
    if (e.key === 'Enter') {
        const command = input.value.trim();
        await executeCommand(command);
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

async function executeCommand(commandLine) {
    if (commandLine) {
        commandHistory.push(commandLine);
        if (commandHistory.length > 100) commandHistory.shift();
        historyIndex = commandHistory.length;
        const terminal = document.getElementById('terminal');
        const inputLine = terminal.querySelector('.input-line');
        // Add the command to terminal history
        const commandDiv = document.createElement('div');
        commandDiv.className = 'terminal-line';
        commandDiv.innerHTML = `<span class="prompt-user">guest</span><span class="header">@</span><span class="prompt-host">localhost</span><span class="header">:</span><span class="prompt-path">/home/yangeorget/pub</span><span class="header">$ </span>${commandLine}`;
        terminal.insertBefore(commandDiv, inputLine);
        // Parse command and arguments
        const parts = commandLine.split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);
        // Execute command
        if (cmd === 'clear') {
            console.log("clear");
            setupTerminal()
            return;
        }
        if (cmd === 'movie') {
            console.log("showMovie");
            showMovie(args);  // do not await
            return;
        }
        let output = null;
        if (commands[cmd]) {
            console.log(cmd);
            output = await commands[cmd](args)
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
