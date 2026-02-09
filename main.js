const generateButton = document.getElementById('generate-button');
const ideaOutput = document.getElementById('idea-output');
const historyList = document.getElementById('history-list');
const themeToggle = document.getElementById('theme-toggle');

const history = [];
const THEME_KEY = 'vibe-theme';

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    themeToggle.textContent = theme === 'dark' ? '라이트 모드' : '다크 모드';
    themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
}

const ideaSeeds = {
    grades: ['중1', '중2', '중3', '고1', '고2'],
    subjects: ['정보', '과학', '사회', '기술·가정', '미술'],
    goals: [
        '문제를 정의하고 해결 과정을 설명한다',
        '데이터를 시각화하여 의미를 해석한다',
        '사용자 피드백을 반영해 기능을 개선한다',
        '협업 규칙을 정하고 역할을 분담한다',
    ],
    activities: [
        '생활 문제를 찾고 인터랙티브 프로토타입 제작',
        '간단한 센서/데이터로 패턴을 분석하는 미니 프로젝트',
        '스토리 기반 인터페이스를 설계하고 발표',
        '미션 카드로 팀별 기능을 완성하는 스프린트',
    ],
    outcomes: [
        '작동하는 데모와 1분 설명 영상',
        '기능 흐름도와 회고 노트',
        '사용자 테스트 결과 요약',
        '역할별 기여 기록',
    ],
    tools: [
        '웹 기반 코딩 도구',
        '스프레드시트 + 간단한 시각화',
        '프레젠테이션 + 프로토타입',
        '화이트보드 협업 도구',
    ],
};

function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function generateIdea() {
    return {
        grade: pick(ideaSeeds.grades),
        subject: pick(ideaSeeds.subjects),
        goal: pick(ideaSeeds.goals),
        activity: pick(ideaSeeds.activities),
        outcome: pick(ideaSeeds.outcomes),
        tool: pick(ideaSeeds.tools),
    };
}

function updateHistory(idea) {
    history.unshift(idea);
    if (history.length > 5) {
        history.pop();
    }

    historyList.innerHTML = '';
    for (const item of history) {
        const li = document.createElement('li');
        li.textContent = `${item.grade} ${item.subject} · ${item.goal}`;
        historyList.appendChild(li);
    }
}


generateButton.addEventListener('click', () => {
    const idea = generateIdea();
    ideaOutput.innerHTML = `
        <div class="idea-card">
            <h3>오늘의 수업 아이디어</h3>
            <ul>
                <li><strong>대상</strong>: ${idea.grade} ${idea.subject}</li>
                <li><strong>목표</strong>: ${idea.goal}</li>
                <li><strong>활동</strong>: ${idea.activity}</li>
                <li><strong>성과물</strong>: ${idea.outcome}</li>
                <li><strong>도구</strong>: ${idea.tool}</li>
            </ul>
        </div>
    `;
    updateHistory(idea);
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
