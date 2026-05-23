let fortuneData = {};
async function loadFortune() {
    try {
        const res = await fetch('./data/fortune.json');
        fortuneData = await res.json();
    } catch (error) {
        console.error("❌ 無法載入吉凶資料", error);
    }
}

let strokeData = {};
async function loadStrokes() {
    try {
        const res = await fetch('./data/stroke.json');
        strokeData = await res.json();
    } catch (error) {
        const AnalysisText = document.getElementById("Analysis");
        if (AnalysisText) AnalysisText.innerText = "❌ 無法載入筆畫資料";
        console.error(error);
    }
}

function getS(char) {
    if (!char) return 0;
    const stroke = strokeData[char];
    if (!stroke) return 0;
    return stroke;
}

function getFortuneScore(level) {
    if (!level) return 3; 
    if (level.includes("大吉")) return 5;
    if (level.includes("大凶")) return 1;
    if (level.includes("吉")) return 4;
    if (level.includes("半吉")) return 3;
    if (level.includes("凶")) return 2;
    return 3;
}

async function main() {
    const params = new URLSearchParams(window.location.search);
    const lastname = params.get("last") || "";
    const firstname = params.get("first") || "";
    const typeValue = params.get("type") || "天格";

    const nameDisplay = document.getElementById("name");
    const typeDisplay = document.getElementById("type");
    const AnalysisText = document.getElementById("Analysis");

    document.body.className = typeValue;

    if (nameDisplay) {
        nameDisplay.innerText = lastname + firstname;
    }

    if (typeDisplay) {
        typeDisplay.innerText = typeValue + "分析";

        const hints = {
            '天格': '代表家族遺傳、長輩緣與少年時期的運勢',
            '人格': '姓名核心！代表主觀意識、內在性格與中心命運',
            '地格': '代表前中期發展、夫妻宮、子女運與部屬關係',
            '外格': '代表社交能力、人際關係、家族外的社會表現',
            '總格': '代表後半生整體運勢、最終成就與晚年歸宿'
        };

        const tooltipSpan = document.createElement('span');
        tooltipSpan.className = 'tooltip-q';
        tooltipSpan.setAttribute('data-hint', hints[typeValue] || '代表社交、人際關係與對外表現');
        tooltipSpan.textContent = '?';
        typeDisplay.appendChild(tooltipSpan);
    }

    const wugeOrder = ['天格', '人格', '外格', '地格', '總格'];
    const nextButton = document.getElementById('nextAnalysisBtn');
    const homeButton = document.getElementById('homeBtn');

    if (homeButton) {
        homeButton.addEventListener('click', function(e) {
            if (e) e.preventDefault();
            window.location.href = 'index.html';
        });
    }

    if (nextButton) {
        const currentIndex = wugeOrder.indexOf(typeValue);

        if (currentIndex !== -1) {
            const nextIndex = (currentIndex + 1) % wugeOrder.length;
            const nextType = wugeOrder[nextIndex];
            
            nextButton.innerText = `分析下一格 (${nextType})`;
            
            nextButton.addEventListener('click', function(e) {
                if (e) e.preventDefault();
                const encodedLast = encodeURIComponent(lastname);
                const encodedFirst = encodeURIComponent(firstname);
                const encodedNextType = encodeURIComponent(nextType);
                window.location.href = `result.html?last=${encodedLast}&first=${encodedFirst}&type=${encodedNextType}`;
            });
        } else {
            nextButton.innerText = "分析下一格";
            nextButton.addEventListener('click', function(e) {
                if (e) e.preventDefault();
                window.location.href = 'index.html';
            });
        }
    }

    await loadStrokes();
    await loadFortune();

    const L1 = getS(lastname[0]);
    const L2 = lastname.length > 1 ? getS(lastname[1]) : 0;
    const F1 = getS(firstname[0]);
    const F2 = firstname.length > 1 ? getS(firstname[1]) : 0;

    if (!L1 || !F1) {
        if (AnalysisText) AnalysisText.innerText = "❌ 有字查不到康熙筆畫";
        return;
    }

    const tianScore = (lastname.length === 1) ? L1 + 1 : L1 + L2;
    const diScore   = (firstname.length === 1) ? F1 + 1 : F1 + F2;
    const renScore  = (lastname.length === 1) ? L1 + F1 : L2 + F1;
    const zongScore = L1 + L2 + F1 + F2;
    const waiScore  = zongScore - renScore + 1;

    let currentScore = 0;
    if (typeValue === "天格") currentScore = tianScore;
    else if (typeValue === "地格") currentScore = diScore;
    else if (typeValue === "人格") currentScore = renScore;
    else if (typeValue === "總格") currentScore = zongScore;
    else if (typeValue === "外格") currentScore = waiScore;
    else {
        if (AnalysisText) AnalysisText.innerText = "❌ 未知的計算類型";
        return;
    }

    const fortune = fortuneData[currentScore];

    if (!fortune) {
        if (document.getElementById("fortuneBadge")) document.getElementById("fortuneBadge").innerText = "吉凶：半吉";
        if (document.getElementById("strokeCount")) document.getElementById("strokeCount").innerText = "筆畫：" + currentScore + " 畫";
        if (document.getElementById("fortuneName")) document.getElementById("fortuneName").innerText = "數理：未收錄";
        if (AnalysisText) AnalysisText.innerText = "解釋：目前吉凶資料庫中無此筆畫之對應詳細解释。";
        return;
    }

    if (document.getElementById("strokeCount")) document.getElementById("strokeCount").innerText = "筆畫：" + currentScore + " 畫";
    if (document.getElementById("fortuneBadge")) document.getElementById("fortuneBadge").innerText =  fortune.level;
    if (document.getElementById("fortuneName")) document.getElementById("fortuneName").innerText = "數理：" + fortune.name;
    if (AnalysisText) AnalysisText.innerText = "解釋：" + fortune.meaning;

    const tianF = fortuneData[tianScore];
    const renF  = fortuneData[renScore];
    const diF   = fortuneData[diScore];
    const waiF  = fortuneData[waiScore];
    const zongF = fortuneData[zongScore];

    const tianChartScore = tianF ? getFortuneScore(tianF.level) : 3;
    const renChartScore  = renF  ? getFortuneScore(renF.level) : 3;
    const diChartScore   = diF   ? getFortuneScore(diF.level) : 3;
    const waiChartScore  = waiF  ? getFortuneScore(waiF.level) : 3;
    const zongChartScore = zongF ? getFortuneScore(zongF.level) : 3;

    const ctx = document.getElementById('radarChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['天格', '人格', '地格', '外格', '總格'],
            datasets: [{
                label: '運勢吉凶評級',
                data: [tianChartScore, renChartScore, diChartScore, waiChartScore, zongChartScore],
                backgroundColor: 'rgba(17, 65, 5, 0.12)',
                borderColor: '#114105',
                borderWidth: 1.5,
                pointBackgroundColor: '#8c2a16',
                pointBorderColor: '#fff',
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                r: {
                    min: 0,
                    max: 5,
                    angleLines: { color: 'rgba(92, 71, 66, 0.2)' },
                    gridLines: { color: 'rgba(92, 71, 66, 0.1)' },
                    pointLabels: {
                        font: { family: '"Zen Old Mincho", serif', size: 13 },
                        color: '#5c4742',
                        padding: 15
                    },
                    ticks: {
                        display: false,
                        beginAtZero: true,
                        stepSize: 1
                    }
                }
            }
        }
    });
}

main();