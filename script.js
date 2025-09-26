
(() => {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Smooth scrolling
  $$("#themeToggle, .nav__link, .cta-row a, .scroll-indicator").forEach(el => {
    if (el.id === "themeToggle") return;
    const target = el.getAttribute("href") || el.dataset.scroll;
    if (!target) return;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(target).scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Theme toggle
  const themeToggle = $("#themeToggle");
  const setTheme = (t) => {
    document.documentElement.dataset.theme = t;
    localStorage.setItem("theme", t);
  };
  themeToggle?.addEventListener("click", () => {
    const next = (localStorage.getItem("theme") === "light") ? "dark" : "light";
    setTheme(next);
  });
  setTheme(localStorage.getItem("theme") || "dark");

  // Footer year
  $("#year").textContent = new Date().getFullYear();

  // Contact mail link
  const email = "kallurubhavesh341@gmail.com";
  $("#emailLink").href = `mailto:${email}?subject=Let's%20build%20something`;

  // Load resume-driven data
  fetch("data.json").then(r => r.json()).then(data => {
    // Trust badges
    const tb = $("#trustBadges");
    (data.trust || ["GDE-level Craft", "95+ Lighthouse", "Shipped @ Scale"]).forEach(x => {
      const li = document.createElement("li");
      li.className = "trust-badge";
      li.innerHTML = `<span>★</span>${x}`;
      tb.appendChild(li);
    });

    // Experience
    const expGrid = $("#experienceGrid");
    (data.experience || []).forEach(role => {
      const card = document.createElement("article");
      card.className = "card";
      const pills = (role.stack || []).map(s => `<span class="pill">${s}</span>`).join("");
      card.innerHTML = `
        <div class="kicker">${role.period || ""}</div>
        <h3>${role.title || ""} — ${role.company || ""}</h3>
        <p>${role.impact || ""}</p>
        <div class="meta">${pills}</div>
      `;
      expGrid.appendChild(card);
    });

    // Projects
    const projGrid = $("#projectsGrid");
    (data.projects || []).forEach(p => {
      const card = document.createElement("article");
      card.className = "card";
      const pills = (p.tags || []).map(s => `<span class="pill">${s}</span>`).join("");
      const link = p.link ? `<a class="btn secondary" href="${p.link}" target="_blank" rel="noopener">Live</a>` : "";
      const code = p.repo ? `<a class="btn ghost" href="${p.repo}" target="_blank" rel="noopener">Code</a>` : "";
      card.innerHTML = `
        <div class="kicker">${p.year || ""}</div>
        <h3>${p.name || ""}</h3>
        <p>${p.summary || ""}</p>
        <div class="meta">${pills}</div>
        <div class="cta-row" style="margin-top:10px">${link} ${code}</div>
      `;
      projGrid.appendChild(card);
    });

    // Skills cloud
    const cloud = $("#skillsCloud");
    (data.skills || []).forEach(s => {
      const span = document.createElement("span");
      span.className = "pill";
      span.textContent = s;
      cloud.appendChild(span);
    });

    // About
    $("#aboutText").textContent = data.about || $("#aboutText").textContent;
    const highlights = $("#highlightsList");
    (data.highlights || []).forEach(h => {
      const li = document.createElement("li"); li.textContent = h; highlights.appendChild(li);
    });
    const statsRow = $("#statsRow");
    (data.stats || []).forEach(st => {
      const div = document.createElement("div"); div.className = "stat"; div.innerHTML = `<strong>${st.value}</strong><div style="font-size:12px; color:#aab0c0">${st.label}</div>`; statsRow.appendChild(div);
    });
  }).catch(() => {});

  // Canvas constellation
  const canvas = document.getElementById("constellation");
  const ctx = canvas.getContext("2d");
  let W, H, points = [];
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    points = Array.from({ length: Math.min(110, Math.floor(W * H / 15000)) }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .6,
      vy: (Math.random() - .5) * .6
    }));
  }
  resize();
  window.addEventListener("resize", resize);

  function step() {
    ctx.clearRect(0,0,W,H);
    for (const p of points) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.2, 0, Math.PI*2); ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.fill();
    }
    // connect nearby
    for (let i=0;i<points.length;i++) {
      for (let j=i+1;j<points.length;j++) {
        const a = points[i], b = points[j];
        const dx = a.x-b.x, dy = a.y-b.y, d = Math.hypot(dx,dy);
        if (d < 120) {
          ctx.strokeStyle = `rgba(180,200,255,${1 - d/120})`;
          ctx.lineWidth = 0.4;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  }
  step();

  // Intersection-based subtle reveal
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => e.target.classList.toggle("in", e.isIntersecting));
  }, { threshold: 0.1 });
  $$(".card, .section__header").forEach(el => io.observe(el));

  // Basic form handler (no backend). Prevents page reload.
  $("#contactForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thanks! I will get back to you shortly.");
    e.target.reset();
  });
})();
