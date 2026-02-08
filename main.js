class LottoBall extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const number = this.getAttribute('number');
        const color = this.getColor(number);

        const ball = document.createElement('div');
        ball.style.backgroundColor = color;
        ball.style.color = 'white';
        ball.style.width = '50px';
        ball.style.height = '50px';
        ball.style.borderRadius = '50%';
        ball.style.display = 'flex';
        ball.style.justifyContent = 'center';
        ball.style.alignItems = 'center';
        ball.style.fontSize = '1.5rem';
        ball.style.fontWeight = 'bold';
        ball.textContent = number;

        shadow.appendChild(ball);
    }

    getColor(number) {
        const num = parseInt(number, 10);
        if (num <= 10) return '#fbc400'; // Yellow
        if (num <= 20) return '#69c8f2'; // Blue
        if (num <= 30) return '#ff7272'; // Red
        if (num <= 40) return '#aaa'; // Gray
        return '#b0d840'; // Green
    }
}

customElements.define('lotto-ball', LottoBall);

const generateButton = document.getElementById('generate-button');
const numbersContainer = document.getElementById('numbers-container');
const historyList = document.getElementById('history-list');

const history = [];

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