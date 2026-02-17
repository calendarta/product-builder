const plannerForm = document.getElementById("planner-form");
const gradeInput = document.getElementById("grade");
const goalInput = document.getElementById("goal");
const strengthInput = document.getElementById("strength");
const concernInput = document.getElementById("concern");
const output = document.getElementById("plan-output");
const historyList = document.getElementById("history-list");

const HISTORY_KEY = "consult-mate-history-v2";

const goalQuestionMap = {
    "학교 적응 확인": [
        "교실에서 아이가 편안해하는 시간대와 활동은 무엇인가요?",
        "등교 직후 적응 상태를 볼 때 선생님이 가장 중요하게 보는 신호는 무엇인가요?",
        "가정에서도 같은 기준으로 확인하면 좋은 적응 지표가 있을까요?"
    ],
    "학습 습관 점검": [
        "수업 중 집중이 잘되는 과목과 어려워하는 과목은 무엇인가요?",
        "숙제 시작이 늦어질 때 학교에서 보이는 패턴이 있나요?",
        "가정 학습 루틴을 교실 흐름과 맞추려면 어떤 방식이 좋을까요?"
    ],
    "또래 관계 상담": [
        "또래와 긍정적 상호작용이 나타나는 상황은 언제인가요?",
        "갈등이 생길 때 반복적으로 보이는 시작 신호가 있나요?",
        "가정에서 연습하면 좋을 의사소통 문장 1~2가지는 무엇인가요?"
    ],
    "정서·행동 지원": [
        "감정 기복이 커지는 순간에 앞서 보이는 신호가 있나요?",
        "교실에서 효과적이었던 진정 전략이 있다면 무엇인가요?",
        "가정에서 동일하게 사용할 수 있는 지원 루틴은 무엇인가요?"
    ],
    "진로·강점 탐색": [
        "아이의 강점이 수업에서 가장 두드러지는 순간은 언제인가요?",
        "강점을 확장하기 위해 학교에서 연결 가능한 활동이 있나요?",
        "가정에서 경험을 확장할 수 있는 실천 아이디어를 추천해 주실 수 있나요?"
    ]
};

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

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
    const summary = `저희 아이(${grade})는 ${strength} 강점이 있습니다. 최근에는 ${concern} 부분이 걱정되어 상담에서 확인하고 싶습니다.`;

    return {
        summary,
        questions,
        actionItems: [
            "상담 후 2주 동안 가정 실천 항목 1개를 기록합니다.",
            "담임교사가 제안한 관찰 기준과 동일한 기준으로 가정에서 점검합니다.",
            "재상담 또는 알림장 피드백 시점(2~4주)을 미리 합의합니다."
        ]
    };
}

function planToPlainText(plan) {
    return [
        "[상담 전달 문장]",
        plan.summary,
        "",
        "[핵심 질문 3개]",
        ...plan.questions.map((q, i) => `${i + 1}. ${q}`),
        "",
        "[상담 후 실행 계획]",
        ...plan.actionItems.map((a, i) => `${i + 1}. ${a}`)
    ].join("\n");
}

function renderPlan(plan) {
    const safeSummary = escapeHtml(plan.summary);
    const questionItems = plan.questions.map((q) => `<li>${escapeHtml(q)}</li>`).join("");
    const actionItems = plan.actionItems.map((a) => `<li>${escapeHtml(a)}</li>`).join("");

    output.innerHTML = `
        <article class="output-card">
            <p class="output-meta">AI 상담 초안 (복사해서 상담 메모로 바로 사용 가능)</p>
            <h3>상담 전달 문장</h3>
            <p>${safeSummary}</p>
            <h3>교사에게 물어볼 핵심 질문</h3>
            <ul>${questionItems}</ul>
            <h3>상담 후 실행 계획</h3>
            <ul>${actionItems}</ul>
            <button type="button" id="copy-plan" class="copy-btn">초안 복사하기</button>
        </article>
    `;

    const copyButton = document.getElementById("copy-plan");
    copyButton.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(planToPlainText(plan));
            copyButton.textContent = "복사 완료";
            setTimeout(() => {
                copyButton.textContent = "초안 복사하기";
            }, 1200);
        } catch {
            copyButton.textContent = "복사 실패";
        }
    });
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
