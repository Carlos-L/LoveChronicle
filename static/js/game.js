let score = 0;
let timer;
let timeLeft = 30;

// 音效文件
const clickSound = new Audio('/static/audio/click.mp3');
const correctSound = new Audio('/static/audio/correct.mp3');
const wrongSound = new Audio('/static/audio/wrong.mp3');
const successSound = new Audio('/static/audio/success.mp3');
const backgroundMusic = new Audio('/static/audio/gamebackground.mp3');
backgroundMusic.loop = true;
backgroundMusic.play();

document.getElementById('start-btn').addEventListener('click', startGame);

function startGame() {
    document.getElementById('start-btn').style.display = 'none';
    loadQuestion();  // 获取题目
    startTimer();
    clickSound.play();
}

function loadQuestion() {
    fetch('/get_question')
        .then(response => response.json())
        .then(data => {
            document.getElementById('question').innerText = data.question;

            if (data.type === "choice") {
                // 显示选择题
                document.getElementById('choice-options').classList.remove('hidden');
                document.getElementById('fill-blank').classList.add('hidden');

                // 生成选择题按钮
                document.getElementById('choice-options').innerHTML = `
                    <button class="answer" onclick="checkAnswer('A')">A: ${data.options.A}</button>
                    <button class="answer" onclick="checkAnswer('B')">B: ${data.options.B}</button>
                    <button class="answer" onclick="checkAnswer('C')">C: ${data.options.C}</button>
                `;
                // 将正确答案存入数据属性，后面验证时用
                document.getElementById('choice-options').dataset.correctAnswer = data.correct_answer;
            } else if (data.type === "fill_in_the_blank") {
                // 显示填空题
                document.getElementById('choice-options').classList.add('hidden');
                document.getElementById('fill-blank').classList.remove('hidden');

                document.getElementById('fill-blank').dataset.correctAnswer = data.correct_answer;
            }
        })
        .catch(error => {
            console.error("加载问题时出错:", error);
            alert("加载问题失败，请稍后再试！");
        });
}

function checkAnswer(answer) {
    if (document.getElementById('choice-options').classList.contains('hidden')) {
        // 处理填空题
        const userAnswer = document.getElementById('user-answer').value.trim();
        const correctAnswer = document.getElementById('fill-blank').dataset.correctAnswer;

        if (userAnswer === correctAnswer) {
            score += 10;
            correctSound.play();
            // alert("答对了！你获得了10分！");
        } else {
            score -= 5;  // 扣分
            wrongSound.play();
            // alert("答案错误，跳过此题！");
        }
    } else {
        // 处理选择题
        const correctAnswer = document.getElementById('choice-options').dataset.correctAnswer;
        if (answer === correctAnswer) {
            score += 10;
            correctSound.play();
            // alert("答对了！你获得了10分！");
        } else {
            score -= 5;  // 扣分
            wrongSound.play();
            // alert("答案错误，跳过此题！");
        }
    }

    document.getElementById('score').innerText = `得分：${score}`;
    setTimeout(loadQuestion, 1);
}

function startTimer() {
    timer = setInterval(function () {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById('timer').innerText = `时间：${timeLeft}`;
        } else {
            clearInterval(timer);
            // alert("时间到！游戏结束！");
            successSound.play();
            submitScore();
        }
    }, 1000);
}

function submitScore() {
    fetch('/submit_score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: score })
    }).then(response => response.json())
      .then(data => {
        //   alert(`总累计得分：${data.total_score}`);
          window.location.href = '/result?score=' + score;
      });
}
