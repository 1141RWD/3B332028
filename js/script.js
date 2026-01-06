// 粒子背景 (保持原樣，效能已優化)
const canvas = document.getElementById('bg-particles');
const ctx = canvas.getContext('2d');
let w, h, particles;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = document.querySelector('.hero').offsetHeight;
  particles = Array.from({ length: Math.floor(w * h / 20000) }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    alpha: Math.random() * 0.7 + 0.2
  }));
}

function step() {
  ctx.clearRect(0, 0, w, h);
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,77,166,${p.alpha})`;
    ctx.fill();
  }
  requestAnimationFrame(step);
}
window.addEventListener('resize', resize);
resize(); step();

// 統一管理 DOM 加載後的邏輯
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Hero 標題進場
  document.querySelectorAll('.hero-title .line').forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }, 300 + i * 250);
  });

  // 2. 滾動揭示 (通用)
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('in');
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // 3. 打字效果
  const typingTarget = document.getElementById('typing-text');
  const fullText = `Ruka（河井瑠花），2002/03/20 生於日本長崎縣對馬市，BABYMONSTER 主舞、主 Rap，於 2023/11/27 以《BATTER UP》正式出道。她擁有長期練習生經歷，舞台掌控力強。`;
  let index = 0;
  function typeText() {
    if (index < fullText.length) {
      typingTarget.innerHTML += fullText[index] === '\n' ? '<br>' : fullText[index];
      index++;
      setTimeout(typeText, 50);
    }
  }
  if (typingTarget) typeText();

  // 4. Marquee 跑馬燈複製 (修正：只對存在的 track 執行一次)
  const galleryTrack = document.querySelector('.marquee-track');
  if (galleryTrack) {
    galleryTrack.innerHTML += galleryTrack.innerHTML;
  }

  // 5. 簽名動畫整合 (解決重複計算問題)
  const sigSvg = document.querySelector('.sig');
  const paths = document.querySelectorAll('.sig-path');

  if (sigSvg && paths.length > 0) {
    // 計算並設定路徑初始長度
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
    });

    // 簽名滾動監控
    const sigObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('start-animation');
          sigObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 }); // 調整為 0.5，讓畫面更進入後再畫，更有感

    sigObserver.observe(sigSvg);
  }

  // --- 新增：漢堡選單邏輯 ---
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  // 切換選單開關
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // 點擊選單選項後，自動關閉選單 (優化體驗)
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
});

// Tilt 與 Parallax (保持原樣，監聽器分開處理較清晰)
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const rx = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const ry = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    card.style.transform = `rotateX(${ry}deg) rotateY(${rx}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0) rotateY(0)';
  });
});

const parallaxEls = document.querySelectorAll('.parallax img');
window.addEventListener('scroll', () => {
  parallaxEls.forEach(img => {
    const rect = img.getBoundingClientRect();
    const shift = (rect.top / window.innerHeight - 0.5) * 12;
    img.style.transform = `translateY(${shift}px) scale(1.05)`;
  });
});
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

// 點擊漢堡按鈕切換選單
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active'); // 讓漢堡變 X (需配合 CSS)
});

// 點擊選單內的連結後自動關閉選單 (優化體驗)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});
