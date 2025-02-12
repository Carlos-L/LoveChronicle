let lotteryPool = { A: [], B: [] };

// 初始化加载数据
async function init() {
    // 加载积分
    const scoreRes = await fetch("/get_score");
    const scoreData = await scoreRes.json();
    document.getElementById("score").textContent = scoreData.total_score;

    // 加载奖池
    const poolRes = await fetch("/get_lottery_pool");
    lotteryPool = await poolRes.json();

    // 加载奖品历史
    const historyRes = await fetch("/get_prize_history");
    const historyData = await historyRes.json();
    renderPrizeHistory(historyData.prize_history);
}

// 渲染奖品历史
// function renderPrizeHistory(prizeHistory) {
//     const prizeList = document.getElementById("prize-list");
//     prizeList.innerHTML = ""; // 清空历史记录

//     prizeHistory.forEach((prize, index) => {
//         const item = document.createElement("div");
//         item.className = "prize-item";
//         item.innerHTML = `
//             <span class="prize-type">${prize.type === "photo" ? "📸" : "🎫"}</span>
//             <span class="prize-name">${prize.name}</span>
//         `;
//         item.addEventListener("click", () => showPrizeDetail(prize));
//         prizeList.appendChild(item);
//     });
// }

// 渲染奖品历史
function renderPrizeHistory(prizeHistory) {
    const prizeList = document.getElementById("prize-list");
    prizeList.innerHTML = ""; // 清空历史记录

    prizeHistory.forEach((prize, index) => {
        const item = document.createElement("div");
        item.className = "prize-item";

        if (prize.type === "photo") {
            item.innerHTML = `
                <span class="prize-type">📸</span>
                <span class="prize-name">${prize.name}</span>
            `;
        } else {
            if (prize.kind === "A") {
                item.innerHTML = `
                <span class="prize-type">🎫</span>
                <span class="prize-name">${prize.name}</span>
            `;
            } else {
                item.innerHTML = `
                <span class="prize-type">🎆</span>
                <span class="prize-name">${prize.name}</span>
            `;
            }
        }
        item.addEventListener("click", () => showPrizeDetail(prize));
        prizeList.appendChild(item);
    });
}

// 显示奖品详情
function showPrizeDetail(prize) {
    const modal = document.getElementById("prize-detail-modal");
    const content = document.getElementById("prize-detail-content");

    if (prize.type === "photo") {
        content.innerHTML = `
            <img src='static/${prize.image}' alt="${prize.name}">
            <p>${prize.name}</p>
        `;
    } else {
        content.innerHTML = `
            <h3>${prize.name}</h3>
            <p>${prize.description}</p>
        `;
    }

    modal.style.display = "block";
}


// 关闭弹窗
function closeModal() {
    const modal = document.getElementById("prize-detail-modal");
    modal.style.display = "none";
}

// 抽奖逻辑
async function drawLottery(type) {
    // 检查积分是否足够
    const cost = type === "exclusive" ? 30 : 10;
    const currentScore = parseInt(document.getElementById("score").textContent);
    if (currentScore < cost) {
        alert("积分不足！");
        return;
    }

    // 调用后端扣分
    const res = await fetch("/lottery_draw", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ type })
    });
    const result = await res.json();

    if (result.status === "success") {
        // 更新积分显示
        document.getElementById("score").textContent = result.remaining_score;
        
        // 更新奖品历史
        const historyRes = await fetch("/get_prize_history");
        const historyData = await historyRes.json();
        renderPrizeHistory(historyData.prize_history);
    }
}

// 初始化页面
document.addEventListener("DOMContentLoaded", init);