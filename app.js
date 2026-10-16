(() => {
  const root = document.documentElement;
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  const photoImage = document.getElementById('photoImage');
  const fallbackFill = document.getElementById('fallbackFill');

  const imageInput = document.getElementById('imageInput');
  const eyebrowInput = document.getElementById('eyebrowInput');
  const mainInput = document.getElementById('mainInput');
  const nameInput = document.getElementById('nameInput');
  const heartColor = document.getElementById('heartColor');
  const textColor = document.getElementById('textColor');
  const beatSpeed = document.getElementById('beatSpeed');
  const clearImage = document.getElementById('clearImage');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const togglePanel = document.getElementById('togglePanel');
  const controlPanel = document.getElementById('controlPanel');

  const eyebrowText = document.getElementById('eyebrowText');
  const mainText = document.getElementById('mainText');
  const nameText = document.getElementById('nameText');

  function bindText(input, output) {
    input.addEventListener('input', () => {
      output.textContent = input.value;
    });
  }

  bindText(eyebrowInput, eyebrowText);
  bindText(mainInput, mainText);
  bindText(nameInput, nameText);

  heartColor.addEventListener('input', () => {
    root.style.setProperty('--heart', heartColor.value);
    fallbackFill.setAttribute('fill', heartColor.value);
  });

  textColor.addEventListener('input', () => {
    root.style.setProperty('--text', textColor.value);
  });

  beatSpeed.addEventListener('input', () => {
    root.style.setProperty('--beat-duration', `${beatSpeed.value}s`);
  });

  imageInput.addEventListener('change', () => {
    const file = imageInput.files && imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      photoImage.setAttribute('href', reader.result);
      photoImage.style.opacity = '1';
      fallbackFill.style.opacity = '.22';
    };
    reader.readAsDataURL(file);
  });

  clearImage.addEventListener('click', () => {
    imageInput.value = '';
    photoImage.removeAttribute('href');
    photoImage.style.opacity = '0';
    fallbackFill.style.opacity = '1';
  });

  fullscreenBtn.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (_) {}
  });

  togglePanel.addEventListener('click', () => {
    const hidden = controlPanel.classList.toggle('hidden');
    togglePanel.textContent = hidden ? 'Hiện chỉnh sửa' : 'Ẩn chỉnh sửa';
  });

  // Particle heart effect — implemented from scratch for this offline demo.
  let width = 0;
  let height = 0;
  let dpr = 1;
  const particles = [];
  const maxParticles = 1200;
  let lastTime = performance.now();

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function heartPoint(t, scale) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return { x: x * scale, y: -y * scale };
  }

  function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const n = parseInt(clean.length === 3
      ? clean.split('').map(c => c + c).join('')
      : clean, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function spawnParticle() {
    const t = Math.random() * Math.PI * 2;
    const scale = Math.min(width, height) / 46;
    const p = heartPoint(t, scale);
    const len = Math.hypot(p.x, p.y) || 1;
    const speed = 28 + Math.random() * 65;

    particles.push({
      x: width / 2 + p.x,
      y: height / 2 + p.y + 8,
      vx: (p.x / len) * speed,
      vy: (p.y / len) * speed,
      life: 0,
      ttl: 1.2 + Math.random() * 1.2,
      size: 1.5 + Math.random() * 3.2,
      wobble: Math.random() * Math.PI * 2,
    });

    if (particles.length > maxParticles) {
      particles.splice(0, particles.length - maxParticles);
    }
  }

  function updateAndDraw(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.033);
    lastTime = now;

    ctx.clearRect(0, 0, width, height);
    const rgb = hexToRgb(heartColor.value);

    const spawnCount = Math.max(2, Math.floor(dt * 190));
    for (let i = 0; i < spawnCount; i++) spawnParticle();

    ctx.globalCompositeOperation = 'lighter';
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life += dt;
      if (p.life >= p.ttl) {
        particles.splice(i, 1);
        continue;
      }

      const k = p.life / p.ttl;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.992;
      p.vy *= 0.992;
      p.wobble += dt * 5;

      const alpha = Math.pow(1 - k, 1.6);
      const size = p.size * (1 + k * 2.2);
      ctx.beginPath();
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
      ctx.arc(p.x + Math.sin(p.wobble) * 2, p.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    requestAnimationFrame(updateAndDraw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(updateAndDraw);
})();
