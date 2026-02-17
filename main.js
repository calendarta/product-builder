const plannerForm = document.getElementById("planner-form");
const gradeInput = document.getElementById("grade");
const goalInput = document.getElementById("goal");
const strengthInput = document.getElementById("strength");
const concernInput = document.getElementById("concern");
const output = document.getElementById("plan-output");
const historyList = document.getElementById("history-list");

const HISTORY_KEY = "consult-mate-history-v1";

const goalQuestionMap = {
    "학교 적응 확인": [
        "교실에서 아이가 편안해하는 시간대와 활동은 무엇인가요?",
        "등교 직후 적응을 돕기 위해 담임 선생님이 보는 핵심 신호가 있을까요?",
        "가정에서 같은 기준으로 확인하면 좋은 적응 지표는 무엇인가요?"
    ],
    "학습 습관 점검": [
        "수업 중 집중이 가장 잘 되는 과목과 어려워하는 과목은 무엇인가요?",
        "숙제 시작이 늦을 때 학교에서 관찰되는 원인이 있나요?",
        "가정 학습 루틴을 교실 흐름과 맞추려면 어떤 방식이 좋을까요?"
    ],
    "또래 관계 상담": [
        "아이의 또래 상호작용에서 긍정적으로 보이는 강점은 무엇인가요?",
        "갈등이 생길 때 주로 어떤 상황에서 시작되나요?",
        "가정에서 연습하면 좋은 사회적 기술 1~2가지는 무엇인가요?"
    ],
    "정서·행동 지원": [
        "교실에서 감정 기복이 커지는 순간은 언제인가요?",
        "안정에 도움이 되었던 교실 전략이 있다면 무엇인가요?",
        "가정에서도 동일하게 적용 가능한 진정 루틴이 있을까요?"
    ],
    "진로·강점 탐색": [
        "아이의 강점이 수업에서 특히 드러나는 장면은 언제인가요?",
        "강점을 더 키우기 위해 학교에서 제공 가능한 기회가 있을까요?",
        "가정에서 경험 확장을 위해 어떤 활동을 연결하면 좋을까요?"
    ]
};

function loadHistory() {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (!saved) {
        return [];
    }

    try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveHistory(history) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function renderHistory(history) {
    historyList.innerHTML = "";
    if (!history.length) {
        const item = document.createElement("li");
        item.textContent = "아직 생성 기록이 없습니다.";
        historyList.appendChild(item);
        return;
    }

    history.forEach((entry) => {
        const item = document.createElement("li");
        item.textContent = `${entry.date} · ${entry.grade} · ${entry.goal}`;
        historyList.appendChild(item);
    });
}

function makePlan({ grade, goal, strength, concern }) {
    const questions = goalQuestionMap[goal] || goalQuestionMap["학교 적응 확인"];
    const summary = `저희 아이(${grade})는 \"${strength}\" 강점이 있습니다. 최근에는 \"${concern}\" 부분이 걱정되어 상담을 요청드립니다.`;

    return {
        summary,
        questions,
        actionItems: [
            "상담 후 1주 동안 가정 실천 항목 1가지를 기록합니다.",
            "담임교사의 관찰 피드백 기준을 가정 기록표와 맞춥니다.",
            "2~4주 뒤 재점검 질문 2개를 미리 정리합니다."
        ]
    };
}

function renderPlan(plan) {
    const questionItems = plan.questions.map((q) => `<li>${q}</li>`).join("");
    const actionItems = plan.actionItems.map((a) => `<li>${a}</li>`).join("");

    output.innerHTML = `
        <article class="output-card">
            <h3>상담 전달 문장</h3>
            <p>${plan.summary}</p>
            <h3>교사에게 물어볼 핵심 질문</h3>
            <ul>${questionItems}</ul>
            <h3>상담 후 실행 계획</h3>
            <ul>${actionItems}</ul>
        </article>
    `;
}

const history = loadHistory();
renderHistory(history);

plannerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = {
        grade: gradeInput.value,
        goal: goalInput.value,
        strength: strengthInput.value.trim(),
        concern: concernInput.value.trim()
    };

    const plan = makePlan(data);
    renderPlan(plan);

    const today = new Date();
    const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    history.unshift({ date, grade: data.grade, goal: data.goal });
    if (history.length > 6) {
        history.pop();
    }

    saveHistory(history);
    renderHistory(history);
});
