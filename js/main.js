// TYPEWRITER + COUNTER
const phrase = "I merge sports technology with human-centered design";
const typeEl = document.getElementById("typeText");
const metricEl = document.querySelector(".metric"); // ← fixed selector
let idx = 0; // ← re-introduced

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

function startCounter() {
  const content = document.querySelector(".below-hero");
  if (!metricEl || !content) return;

  metricEl.style.opacity = "1";
  metricEl.style.transform = "translateX(0)";

  let n = 0,
    target = 100,
    maxBlur = 20;

  const int = setInterval(() => {
    const pct = (n / target) * 100;
    metricEl.textContent = `Taking Projects From 0 to ${n}%`;
    metricEl.style.setProperty("--progress", `${pct}%`);

    const blur = maxBlur * (1 - n / target);
    content.style.setProperty("--blur-radius", `${blur}px`);

    if (n++ >= target) {
      clearInterval(int);
      content.style.setProperty("--blur-radius", `0px`);
    }
  }, 30);
}

function updateNavigation() {
  const scrollPosition = window.scrollY + 100;
  document.querySelectorAll("section[id]").forEach((section) => {
    const top = section.offsetTop,
      height = section.offsetHeight,
      id = section.getAttribute("id");
    if (scrollPosition >= top && scrollPosition < top + height) {
      document.querySelectorAll(".site-nav a").forEach((link) => {
        const isActive = link.getAttribute("href").includes(id);
        link.classList.toggle("active", isActive);
        if (isActive) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    }
  });
}

function initTimeline() {
  document.querySelectorAll(".timeline").forEach((tl) => {
    const steps = tl.dataset.steps.split("→");
    const lineDiv = document.createElement("div");
    lineDiv.className = "line";
    const football = document.createElement("div");
    football.className = "football";
    lineDiv.appendChild(football);
    tl.innerHTML = "";
    tl.appendChild(lineDiv);
    steps.forEach((s) => {
      const span = document.createElement("span");
      span.textContent = s.trim();
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
  // 0) Skip blur on back/forward
  if (performance.getEntriesByType("navigation")[0]?.type === "back_forward") {
    document.querySelector(".below-hero")?.classList.add("noblur");
  }

  // 1) Typewriter + Counter
  if (typeEl) {
    idx = 0;
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      metricEl.style.opacity = 0;
      metricEl.style.transform = "translateX(-20px)";
      metricEl.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      setTimeout(typeLoop, 500);
    } else {
      typeEl.textContent = phrase;
      metricEl.textContent = "100%";
    }
  }

  // 2) Scroll-reveal for cards, timeline items, stats
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

  // 3) Init Journey timeline
  initTimeline();

  // 4) Nav highlighting & smooth scroll
  updateNavigation();
  window.addEventListener("scroll", updateNavigation);
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // 5) If we’re on the About page, immediately reveal its timeline
  if (document.body.classList.contains("about-page")) {
    document
      .querySelectorAll(".vertical-timeline li")
      .forEach((li) => li.classList.add("reveal"));
  }
});
