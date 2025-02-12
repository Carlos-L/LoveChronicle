from flask import Flask, render_template, jsonify, request, session
import os
import json
from random import choice

app = Flask(__name__)

app.secret_key = "123456"  # 设置密钥用于 session

if not os.path.exists("data"):
    os.makedirs("data")

# 游戏积分存储路径
GAME_DATA_PATH = "data/scores.json"
PRIZE_HISTORY_PATH = "data/prize_history.json"



# 加载游戏数据
def load_game_data():
    if not os.path.exists(GAME_DATA_PATH):
        return {}  # 如果文件不存在，返回空字典
    with open(GAME_DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

# 保存游戏数据
def save_game_data(data):
    with open(GAME_DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

# 加载数据
def load_data(filename):
    with open(os.path.join("data", filename), "r", encoding="utf-8") as f:
        return json.load(f)

# 加载奖品历史
def load_prize_history():
    if not os.path.exists(PRIZE_HISTORY_PATH):
        return {"total_score": []}  # 如果文件不存在，返回默认数据
    with open(PRIZE_HISTORY_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

# 保存奖品历史
def save_prize_history(data):
    with open(PRIZE_HISTORY_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
# 保存数据
def save_data(filename, data):
    with open(os.path.join("data", filename), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

# 首页
@app.route("/")
def home():
    return render_template("index.html")

# 时间线页面
@app.route("/timeline")
def timeline():
    timeline_data = load_data("timeline.json")
    return render_template("timeline.html", timeline=timeline_data)

# # 游戏页面
# @app.route("/game")
# def game():
#     return render_template("game.html")

# 照片墙页面
@app.route("/gallery")
def gallery():
    gallery_data = load_data("gallery.json")
    return render_template("gallery.html", gallery=gallery_data)

# 留言板页面
@app.route("/messages")
def messages():
    messages_data = load_data("messages.json")
    return render_template("messages.html", messages=messages_data)

# 提交留言
@app.route("/submit_message", methods=["POST"])
def submit_message():
    name = request.form.get("name")
    content = request.form.get("content")
    new_message = {"name": name, "content": content}
    messages_data = load_data("messages.json")
    messages_data.append(new_message)
    save_data("messages.json", messages_data)
    return jsonify({"status": "success", "message": "留言提交成功！"})
# 抽奖页面
@app.route("/lottery")
def lottery():
    return render_template("lottery.html")

# 获取积分
@app.route("/get_score")
def get_score():
    user_id = session.get("user_id", "total_score")  # 默认用户
    game_data = load_game_data()
    return jsonify({"total_score": game_data.get(user_id, 0)})

# 更新积分
@app.route("/update_score", methods=["POST"])
def update_score():
    user_id = session.get("user_id", "total_score")
    score = request.json.get("score", 0)
    
    game_data = load_game_data()
    game_data[user_id] = game_data.get(user_id, 0) + score
    save_game_data(game_data)
    
    return jsonify({"status": "success", "total_score": game_data[user_id]})

# 获取奖池
@app.route("/get_lottery_pool")
def get_lottery_pool():
    with open("data/lottery_pool.json", "r", encoding="utf-8") as f:
        return jsonify(json.load(f))

# 抽奖逻辑
@app.route("/lottery_draw", methods=["POST"])
def lottery_draw():
    user_id = session.get("user_id", "total_score")
    lottery_type = request.json.get("type")  # "normal" 或 "exclusive"
    
    # 获取积分数据
    game_data = load_game_data()
    current_score = game_data.get(user_id, 0)
    
    # 检查积分是否足够
    cost = 30 if lottery_type == "exclusive" else 10
    if current_score < cost:
        return jsonify({"status": "error", "message": "积分不足！"})
    
    # 扣除积分
    game_data[user_id] = current_score - cost
    save_game_data(game_data)
    
    with open("data/lottery_pool.json", "r", encoding="utf-8") as f:
        lottery_pool = json.load(f)
    
    # 根据抽奖类型选择奖池
    if lottery_type == "exclusive":
        pool = [item for item in lottery_pool["A"] if item["type"] == "card"]
    else:
        pool = lottery_pool["A"] + lottery_pool["B"]

    # 随机抽取奖品
    prize = choice(pool)
    
    # 保存奖品历史
    prize_history = load_prize_history()
    if user_id not in prize_history:
        prize_history[user_id] = []
    prize_history[user_id].append(prize)
    save_prize_history(prize_history)
    
    # 返回成功响应
    return jsonify({
        "status": "success",
        "remaining_score": game_data[user_id],
        "prize": prize
    })

# 获取奖品历史
@app.route("/get_prize_history")
def get_prize_history():
    user_id = session.get("user_id", "total_score")
    prize_history = load_prize_history()
    return jsonify({"prize_history": prize_history.get(user_id, [])})

# 读取 questions.json
def load_questions():
    with open("data/questions.json", "r", encoding="utf-8") as f:
        return json.load(f)

# 读取并更新 scores.json
def load_scores():
    if not os.path.exists("data/scores.json"):
        with open("data/scores.json", "w") as f:
            json.dump({"total_score": 0}, f)
    with open("data/scores.json", "r", encoding="utf-8") as f:
        return json.load(f)

def update_score(new_score):
    scores = load_scores()
    scores["total_score"] += new_score
    with open("data/scores.json", "w", encoding="utf-8") as f:
        json.dump(scores, f)

@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/get_question')
def get_question():
    questions = load_questions()
    question = choice(questions)  # 随机获取一道题
    return jsonify(question)

@app.route('/submit_score', methods=['POST'])
def submit_score():
    score = request.json.get('score', 0)
    update_score(score)
    return jsonify({"message": "Score updated", "total_score": load_scores()["total_score"]})

@app.route('/result')
def result():
    # 从session或者数据库中获取得分
    score = request.args.get('score', 0)
    return render_template('result.html', score=score)
@app.route('/scores')
def scores():
    scores = load_scores()
    return render_template('scores.html', total_score=scores["total_score"])

if __name__ == "__main__":
    app.run(debug=True)