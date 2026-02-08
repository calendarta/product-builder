class LottoBall extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const number = this.getAttribute('number');

        const style = document.createElement('style');
        style.textContent = `
            .ball {
                background-color: var(--ball-bg, #c8f36a);
                color: var(--ball-text, #1f2a12);
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1.5rem;
                font-weight: bold;
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.18);
            }
        `;

        const ball = document.createElement('div');
        ball.className = 'ball';
        ball.textContent = number;

        shadow.appendChild(style);
        shadow.appendChild(ball);
    }
}

customElements.define('lotto-ball', LottoBall);

const generateButton = document.getElementById('generate-button');
const numbersContainer = document.getElementById('numbers-container');
const historyList = document.getElementById('history-list');
const themeToggle = document.getElementById('theme-toggle');

const history = [];
const THEME_KEY = 'lotto-theme';

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    themeToggle.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
}

function generateNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function updateHistory(numbers) {
    history.unshift(numbers);
    if (history.length > 5) {
        history.pop();
    }

    historyList.innerHTML = '';
    for (const numberSet of history) {
        const li = document.createElement('li');
        li.textContent = numberSet.join(', ');
        historyList.appendChild(li);
    }
}


generateButton.addEventListener('click', () => {
    const newNumbers = generateNumbers();
    numbersContainer.innerHTML = '';
    for (const number of newNumbers) {
        const lottoBall = document.createElement('lotto-ball');
        lottoBall.setAttribute('number', number);
        numbersContainer.appendChild(lottoBall);
    }
    updateHistory(newNumbers);
});

const savedTheme = localStorage.getItem(THEME_KEY);
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
applyTheme(initialTheme);

themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
});
