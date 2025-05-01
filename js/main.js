// TYPEWRITER + COUNTER
const phrase = "I merge sports technology with human-centered design";
const typeEl = document.getElementById("typeText");
const metricEl = document.getElementById("metricNum");
let idx = 0;

function typeLoop() {
  if (typeEl && idx <= phrase.length) {
    typeEl.classList.add("typing"); // Add cursor while typing
    typeEl.textContent = phrase.slice(0, idx++);
    setTimeout(() => requestAnimationFrame(typeLoop), 50);
  } else {
    // Keep cursor blinking for 1.5 seconds after typing
    setTimeout(() => {
      typeEl.classList.remove("typing"); // Remove cursor
      startCounter(); // Start the counter animation
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
  const maxBlur = 20; // matches your CSS default

  const int = setInterval(() => {
    // 1) update counter + fill
    const pct = (n / target) * 100;
    metric.textContent = `Taking Projects From 0 to ${n}%`;
    metric.style.setProperty("--progress", `${pct}%`);

    // 2) compute remaining blur: goes from maxBlur→0
    const blur = maxBlur * (1 - n / target);
    content.style.setProperty("--blur-radius", `${blur}px`);

    // finish
    if (n++ >= target) {
      clearInterval(int);
      content.style.setProperty("--blur-radius", `0px`);
    }
  }, 30);
}

// Color interpolation helper function
function interpolateColor(color1, color2, factor) {
  // Convert hex to RGB
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  // Interpolate each channel
  const r = Math.round(c1.r + (c2.r - c1.r) * factor);
  const g = Math.round(c1.g + (c2.g - c1.g) * factor);
  const b = Math.round(c1.b + (c2.b - c1.b) * factor);

  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace("#", "");

  // Handle both short and long hex
  const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16);
  const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16);
  const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16);

  return { r, g, b };
}

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.15,
  rootMargin: "50px",
};

// Animate stat numbers
function animateNumber(element) {
  const target = parseInt(element.dataset.stat);
  const duration = 1500;
  const start = Date.now();

  const update = () => {
    const now = Date.now();
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(target * progress);
    element.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  update();
}

// ESPN-style stat banner
function showStatBanner(text) {
  const banner = document.createElement("div");
  banner.className = "stat-banner";
  banner.textContent = text;
  document.body.appendChild(banner);

  // Force reflow
  banner.offsetHeight;

  requestAnimationFrame(() => {
    banner.classList.add("show");

    setTimeout(() => {
      banner.classList.remove("show");
      setTimeout(() => banner.remove(), 400);
    }, 3000);
  });
}

// Handle navigation highlighting
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".site-nav a");

function updateNavigation() {
  const scrollPosition = window.scrollY + 100; // Offset for header

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(sectionId)) {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }
  });
}

window.addEventListener("scroll", updateNavigation);
updateNavigation(); // Initial call

// Handle smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// TIMELINE SCROLL‑TRIGGER
document.querySelectorAll(".timeline").forEach((tl) => {
  const steps = tl.dataset.steps.split("→");

  // Create the line and football elements
  const lineDiv = document.createElement("div");
  lineDiv.className = "line";

  const football = document.createElement("div");
  football.className = "football";
  lineDiv.appendChild(football);

  // Build timeline HTML
  tl.innerHTML = "";
  tl.appendChild(lineDiv);
  steps.forEach((s) => {
    const span = document.createElement("span");
    span.textContent = s.trim();
    tl.appendChild(span);
  });

  // Observe timeline
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        tl.classList.add("in");
        observer.disconnect();
      }
    },
    { threshold: 0.4 }
  );
  observer.observe(tl);
});

// main.js

// … all your helper functions (typeLoop, startCounter, animateNumber, etc.) …

document.addEventListener("DOMContentLoaded", () => {
  // 1. Typewriter + Counter
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelector(".metric").style.opacity = 0;
    document.querySelector(".metric").style.transform = "translateX(-20px)";
    document.querySelector(".metric").style.transition =
      "opacity 0.6s ease, transform 0.6s ease";
    setTimeout(typeLoop, 500);
  } else {
    typeEl.textContent = phrase;
    metricEl.textContent = "100";
  }

  // 2. Scroll-reveal cards
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => card.classList.add("pre-reveal"));
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
  cards.forEach((card) => revealObserver.observe(card));

  // 3. Stats animation (if you’re still using data-stat attributes)
  document
    .querySelectorAll("[data-stat]")
    .forEach((el) => observer.observe(el));

  // 4. Hero text fade-in is already covered by your CSS keyframes
});
