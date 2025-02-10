from flask import Flask, render_template, jsonify, request
import os
import json

app = Flask(__name__)

# 加载数据
def load_data(filename):
    with open(os.path.join("data", filename), "r", encoding="utf-8") as f:
        return json.load(f)

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

# 游戏页面
@app.route("/game")
def game():
    return render_template("game.html")

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

if __name__ == "__main__":
    app.run(debug=True)