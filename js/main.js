// TYPEWRITER + COUNTER
const phrase = "I merge sports technology with human-centered design";
const typeEl = document.getElementById("typeText");
const metricEl = document.getElementById("metricNum");

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
  const metric = document.querySelector(".metric");
  const content = document.querySelector(".below-hero");
  if (!metric || !content) return;

  metric.style.opacity = "1";
  metric.style.transform = "translateX(0)";

  let n = 0,
    target = 100;
  const maxBlur = 20;

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

function updateNavigation() {
  const scrollPosition = window.scrollY + 100;
  document.querySelectorAll("section[id]").forEach((section) => {
    const top = section.offsetTop,
      height = section.offsetHeight,
      id = section.getAttribute("id");
    if (scrollPosition >= top && scrollPosition < top + height) {
      document.querySelectorAll(".site-nav a").forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href").includes(id));
        if (link.classList.contains("active")) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
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
  const belowHero = document.querySelector(".below-hero");
  if (performance.getEntriesByType("navigation")[0]?.type === "back_forward") {
    belowHero?.classList.add("noblur");
  }

  // 1) Typewriter + Counter (only if #typeText exists)
  if (typeEl) {
    let idx = 0;
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

  // 2) Scroll-reveal for cards, stats, timeline items
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

  document
    .querySelectorAll(".card, .vertical-timeline li, [data-stat]")
    .forEach((el) => {
      el.classList.add("pre-reveal");
      revealObserver.observe(el);
    });

  // 3) Hero text fade-in is CSS-handled

  // 4) Init journey timeline
  initTimeline();

  // 5) Navigation highlighting & smooth scroll
  updateNavigation();
  window.addEventListener("scroll", updateNavigation);
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target)
        target.scrollIntoView({
          behavior: "smooth",
        });
    });
  });
});
