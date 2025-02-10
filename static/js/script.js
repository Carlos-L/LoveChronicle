// 小狼狼动画交互
const wolf = document.getElementById("wolf");

wolf.addEventListener("click", () => {
    wolf.style.animation = "wolfJump 0.5s";
    setTimeout(() => {
        wolf.style.animation = "wolfIdle 2s infinite";
    }, 500);
});