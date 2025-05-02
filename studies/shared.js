// Active Navigation
document.addEventListener("DOMContentLoaded", function () {
  // Get all sections and nav links
  const sections = document.querySelectorAll(".cs-section");
  const navLinks = document.querySelectorAll(".cs-subnav__link");

  // Update active nav link based on scroll position
  const updateActiveNavLink = () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 100) {
        current = "#" + section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === current) {
        link.classList.add("active");
      }
    });
  };

  // Update on scroll
  window.addEventListener("scroll", updateActiveNavLink);

  // Initial check for active section
  updateActiveNavLink();

  // Mobile Navigation Toggle
  const mobileToggle = document.querySelector(".cs-subnav__mobile-toggle");
  const navList = document.querySelector(".cs-subnav__list");

  if (mobileToggle && navList) {
    mobileToggle.addEventListener("click", () => {
      navList.classList.toggle("active");
      mobileToggle.classList.toggle("active");
    });
  }
});
