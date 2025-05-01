// TYPEWRITER + COUNTER
const phrase = "I merge sports technology with human-centered design";
let idx = 0; // ← restore this!
const typeEl = document.getElementById("typeText");
const metricEl = document.getElementById("metricNum");

// 1) Typewriter
function typeLoop() {
  if (typeEl && idx <= phrase.length) {
    typeEl.classList.add("typing");
    typeEl.textContent = phrase.slice(0, idx++);
    setTimeout(() => requestAnimationFrame(typeLoop), 50);
  } else {
    setTimeout(() => {
      typeEl.classList.remove("typing");
      startCounter();
      document.body.classList.add("intro-loaded");
    }, 1500);
  }
}

// 2) Counter + blur‐reveal
function startCounter() {
  const metric = document.querySelector(".metric");
  const content = document.querySelector(".below-hero");
  if (!metric || !content) return;

  metric.style.opacity = "1";
  metric.style.transform = "translateX(0)";

  let n = 0,
    target = 100,
    maxBlur = 20;

  const int = setInterval(() => {
    const pct = (n / target) * 100;
    metric.textContent = `Taking Projects From 0 to ${n}%`;
    metric.style.setProperty("--progress", `${pct}%`);

    const blur = maxBlur * (1 - n / target);
    content.style.setProperty("--blur-radius", `${blur}px`);

    if (n++ >= target) {
      clearInterval(int);
      content.style.setProperty("--blur-radius", `0px`);
    }
  }, 30);
}

// 3) Stat-counter animation
function animateNumber(el) {
  const target = parseInt(el.dataset.stat, 10);
  const duration = 1500;
  const start = Date.now();

  (function update() {
    const now = Date.now();
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * progress);
    if (progress < 1) requestAnimationFrame(update);
  })();
}

// 4) Navigation highlighting
function updateNavigation() {
  const scrollY = window.scrollY + 100;
  document.querySelectorAll("section[id]").forEach((section) => {
    const top = section.offsetTop,
      height = section.offsetHeight,
      id = section.getAttribute("id");
    if (scrollY >= top && scrollY < top + height) {
      document.querySelectorAll(".site-nav a").forEach((link) => {
        const active = link.getAttribute("href").includes(id);
        link.classList.toggle("active", active);
        active
          ? link.setAttribute("aria-current", "page")
          : link.removeAttribute("aria-current");
      });
    }
  });
}

// 5) Build & reveal your timeline
function initTimeline() {
  document.querySelectorAll(".timeline").forEach((tl) => {
    const steps = tl.dataset.steps.split("→").map((s) => s.trim());
    const line = document.createElement("div");
    line.className = "line";
    const football = document.createElement("div");
    football.className = "football";
    line.appendChild(football);

    tl.innerHTML = "";
    tl.appendChild(line);
    steps.forEach((s) => {
      const span = document.createElement("span");
      span.textContent = s;
      tl.appendChild(span);
    });

    new IntersectionObserver(
      (entries, obs) => {
        if (entries[0].isIntersecting) {
          tl.classList.add("in");
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    ).observe(tl);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // — skip blur on back/forward
  const belowHero = document.querySelector(".below-hero");
  if (performance.getEntriesByType("navigation")[0]?.type === "back_forward") {
    belowHero?.classList.add("noblur");
  }

  // — 1) typewriter + counter
  if (typeEl) {
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      metricEl.style.opacity = 0;
      metricEl.style.transform = "translateX(-20px)";
      metricEl.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      setTimeout(typeLoop, 500);
    } else {
      typeEl.textContent = phrase;
      metricEl.textContent = "100";
    }
  }

  // — 2) scroll‐reveal cards & timeline entries
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".card, .vertical-timeline li").forEach((el) => {
    el.classList.add("pre-reveal");
    revealObserver.observe(el);
  });

  // — 3) stats animation observer (you’d removed this!)
  const statObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateNumber(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll("[data-stat]").forEach((el) => {
    statObserver.observe(el);
  });

  // — 4) hero fade‐in is CSS
  // — 5) timeline
  initTimeline();

  // — 6) nav + smooth scroll
  updateNavigation();
  window.addEventListener("scroll", updateNavigation);
  document.querySelectorAll('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(a.getAttribute("href"))?.scrollIntoView({
        behavior: "smooth",
      });
    })
  );

  // — Bonus: immediately reveal “About” timeline items
  if (document.body.classList.contains("about-page")) {
    document
      .querySelectorAll(".vertical-timeline li")
      .forEach((li) => li.classList.add("reveal"));
  }
});
