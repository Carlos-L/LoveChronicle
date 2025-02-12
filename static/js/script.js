document.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("background-music");
    const playPauseBtn = document.getElementById("play-pause-btn");

    // 播放/暂停音乐
    playPauseBtn.addEventListener("click", () => {
        if (music.paused) {
            music.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            music.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    // 小狼狼动画
    const wolf = document.getElementById("wolf");
    wolf.addEventListener("click", () => {

        const wolf_audio = new Audio('/static/audio/wolf.mp3');  // 假设音效文件名为 fireworks.mp3
        wolf_audio.play();
        
        wolf.style.animation = "wolfJump 0.5s";
        setTimeout(() => {
            wolf.style.animation = "wolfIdle 2s infinite";
        }, 500);
    });

});