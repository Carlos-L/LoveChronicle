document.addEventListener("DOMContentLoaded", () => {
    const envelope = document.getElementById("envelope");
    const envelopeFlap = document.getElementById("envelope-flap");
    const letter = document.getElementById("letter");
    const content = document.getElementById("content");

    envelope.addEventListener("click", () => {
        // 打开信封
        envelopeFlap.style.transform = "rotateX(180deg)";
        envelopeFlap.style.transition = "transform 0.5s ease";

        // 显示信纸
        setTimeout(() => {
            letter.style.opacity = "1";
            letter.style.transform = "translate(-50%, -50%) scale(1)";
        }, 500);

        // 隐藏信封，显示页面内容
        setTimeout(() => {
            document.getElementById("envelope-overlay").style.display = "none";
            content.classList.remove("hidden");
        }, 2000);
    });
});