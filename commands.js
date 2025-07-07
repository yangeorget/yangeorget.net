function banner_command(args) {
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
}

function help_command(args) {
    return [
        'Available commands:',
        '  cat         - Display file contents',
        '  clear       - Clear the terminal screen',
        '  date        - Display current date and time',
        '  echo        - Display text',
        '  fortune     - Display a random fortune',
        '  github      - Open GitHub in a new tab',
        '  help        - Show this help message',
        '  history     - Show command history',
        '  linkedin    - Open LinkedIn in a new tab',
        '  ls          - List directory contents',
        '  movie w h   - Show a movie of size w x h (press any key to stop)',
        '  picture w h - Display a picture of size w x h',
        '  pwd         - Print working directory',
        '  resume lang - Open a new tab with my resume in the given language (en or fr)',
        '  whoami      - Print current username'
    ];
}

function cat_command(args) {
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
}

function date_command() {
    const now = new Date();
    return [now.toString()];
}

function echo_command(args) {
    return [args.join(' ')];
}

function fortune_command(args) {
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

function github_command(args) {
    window.open('https://github.com/yangeorget', '_blank');
    return [];
}

function history_command(args) {
    if (commandHistory.length === 0) {
        return [];
    }
    const output = [];
    commandHistory.slice(-20).forEach((cmd, i) => {
        output.push(`  ${(i + 1).toString().padStart(3)}: ${cmd}`);
    });
    return output;
}

function linkedin_command(args) {
    window.open('https://www.linkedin.com/in/yangeorget', '_blank');
    return [];
}

function ls_command(args) {
    return ["README.txt"];
}

async function picture_command(args) {
    const width = args[0] ? args[0] : 100;
    const height = args[1] ? args[1] : 90;
    const canvas = document.getElementById('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d', {willReadFrequently: true});
    const img = new Image();
    img.src = "https://raw.githubusercontent.com/yangeorget/yangeorget/main/head.png";
    img.setAttribute('crossOrigin', 'anonymous');
    await img.decode();
    context.drawImage(img, 0, 0, width, height);
    return processImage(context, width, height);
}

function resume_command(args) {
    if (!args[0]) {
        args[0] = 'en';
    }
    if (args[0] === 'en') {
        return ["https://www.vulpesleo.com/cv_yan_georget_en.pdf"];
    }
    if (args[0] === 'fr') {
        return ["https://www.vulpesleo.com/cv_yan_georget_fr.pdf"];
    }
    return [`resume: ${args[0]}: Unexpected language`];
}

function whoami_command(args) {
   return ["guest"];
}
