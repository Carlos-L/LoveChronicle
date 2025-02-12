document.addEventListener('click', function (e) {
    const numParticles = 50;  // 烟花的粒子数量
    const colors = ['#ff0055', '#ffcc00', '#00ff88', '#00aaff', '#ff77ff'];  // 粒子的颜色

    // // 播放音效
    // const audio = new Audio('/static/audio/firework.mp3');  // 假设音效文件名为 fireworks.mp3
    // audio.play();
  
    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
  
      // 随机位置和颜色
      const size = Math.random() * 5 + 5;  // 粒子大小
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
  
      const color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.backgroundColor = color;
  
      // 设置随机的粒子爆炸方向
      const angle = Math.random() * 2 * Math.PI; // 随机角度
      const distance = Math.random() * 150 + 50;  // 随机爆炸距离
  
      const velocityX = Math.cos(angle) * distance;
      const velocityY = Math.sin(angle) * distance;
  
      // 设置初始位置
      particle.style.left = `${e.clientX - size / 2}px`;
      particle.style.top = `${e.clientY - size / 2}px`;
  
      document.body.appendChild(particle);
  
      // 设置动画效果
      particle.animate([
        { transform: `translate(0, 0)` }, 
        { transform: `translate(${velocityX}px, ${velocityY}px)` }
      ], {
        duration: 1500, // 持续时间
        easing: 'ease-out'
      });
  
      // 动画结束后删除粒子
      setTimeout(() => {
        particle.remove();
      }, 1500);
    }
  });
  