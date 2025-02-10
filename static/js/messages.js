document.getElementById("message-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const content = document.getElementById("content").value;

    const response = await fetch("/submit_message", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `name=${encodeURIComponent(name)}&content=${encodeURIComponent(content)}`,
    });

    if (response.ok) {
        alert("留言提交成功！");
        location.reload(); // 刷新页面以加载新留言
    } else {
        alert("留言提交失败，请重试。");
    }
});