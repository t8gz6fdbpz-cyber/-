const fadeItems = document.querySelectorAll(".fade-up, .fade-side");
const magnetElements = document.querySelectorAll("[data-magnet]");
const marqueeRows = document.querySelectorAll("[data-marquee-row]");
const animatedTextBlocks = document.querySelectorAll("[data-animated-text]");
const stackCards = document.querySelectorAll("[data-stack-card]");
const horizontalGalleries = document.querySelectorAll("[data-horizontal-gallery]");

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const delay = Number(entry.target.getAttribute("data-delay") || "0");
      window.setTimeout(() => {
        entry.target.classList.add("is-visible");
      }, delay);
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.08,
  },
);

fadeItems.forEach((item) => revealObserver.observe(item));

const initMagnet = () => {
  magnetElements.forEach((element) => {
    const strength = Number(element.getAttribute("data-strength") || "3");
    const padding = Number(element.getAttribute("data-padding") || "120");
    const activeTransition =
      element.getAttribute("data-active-transition") || "transform 0.3s ease-out";
    const inactiveTransition =
      element.getAttribute("data-inactive-transition") ||
      "transform 0.6s ease-in-out";

    const resetTransform = () => {
      element.style.transition = inactiveTransition;
      element.style.transform = "translate3d(0px, 0px, 0px)";
    };

    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingClientRect();
      const inRangeX =
        event.clientX >= rect.left - padding && event.clientX <= rect.right + padding;
      const inRangeY =
        event.clientY >= rect.top - padding && event.clientY <= rect.bottom + padding;

      if (!inRangeX || !inRangeY) {
        resetTransform();
        return;
      }

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const offsetX = (event.clientX - centerX) / strength;
      const offsetY = (event.clientY - centerY) / strength;

      element.style.transition = activeTransition;
      element.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0px)`;
    });

    element.addEventListener("mouseleave", resetTransform);
  });
};

const initMarqueeRows = () => {
  marqueeRows.forEach((row) => {
    const track = row.querySelector(".marquee-track");
    if (!track || track.dataset.ready === "true") {
      return;
    }

    const originals = Array.from(track.children);
    for (let cloneIndex = 0; cloneIndex < 2; cloneIndex += 1) {
      originals.forEach((item) => {
        track.appendChild(item.cloneNode(true));
      });
    }

    track.dataset.ready = "true";
  });
};

const initAnimatedText = () => {
  animatedTextBlocks.forEach((block) => {
    const text = block.getAttribute("data-text") || "";
    if (!text || block.dataset.ready === "true") {
      return;
    }

    const fragment = document.createDocumentFragment();
    Array.from(text).forEach((character, index) => {
      const span = document.createElement("span");
      span.className = character === " " ? "char space" : "char";
      span.dataset.index = String(index);
      span.textContent = character === " " ? "\u00a0" : character;
      fragment.appendChild(span);
    });

    block.appendChild(fragment);
    block.dataset.ready = "true";
  });
};

const updateAnimatedText = () => {
  animatedTextBlocks.forEach((block) => {
    const chars = block.querySelectorAll(".char");
    if (!chars.length) {
      return;
    }

    const rect = block.getBoundingClientRect();
    const start = window.innerHeight * 0.8;
    const end = window.innerHeight * 0.2;
    const progress = clamp((start - rect.top) / Math.max(1, start - end), 0, 1);
    const total = chars.length;

    chars.forEach((char, index) => {
      const charStart = index / total;
      const charEnd = (index + 1) / total;
      const localProgress = clamp((progress - charStart) / Math.max(0.001, charEnd - charStart), 0, 1);
      char.style.opacity = String(0.2 + localProgress * 0.8);
    });
  });
};

const updateMarqueeRows = () => {
  marqueeRows.forEach((row) => {
    const track = row.querySelector(".marquee-track");
    if (!track) {
      return;
    }

    const sectionRect = row.getBoundingClientRect();
    const sectionTop = window.scrollY + sectionRect.top;
    const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
    const direction = row.getAttribute("data-marquee-row") === "forward" ? 1 : -1;
    const translateX = direction === 1 ? offset - 200 : -(offset - 200);
    track.style.transform = `translate3d(${translateX}px, 0px, 0px)`;
  });
};

const updateStackCards = () => {
  const totalCards = stackCards.length;

  stackCards.forEach((card, index) => {
    if (window.innerWidth <= 1024) {
      card.style.transform = "scale(1)";
      return;
    }

    const rect = card.getBoundingClientRect();
    const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight * 0.9), 0, 1);
    const targetScale = 1 - (totalCards - 1 - index) * 0.03;
    const scale = 1 - (1 - targetScale) * progress;
    const stackOffset = card.style.getPropertyValue("--stack-offset") || "0px";

    card.style.top = `calc(1.5rem + ${stackOffset})`;
    card.style.transform = `scale(${scale})`;
  });
};

const setupHorizontalGalleries = () => {
  horizontalGalleries.forEach((section) => {
    const sticky = section.querySelector(".gallery-sticky");
    const track = section.querySelector(".gallery-track");

    if (!sticky || !track) {
      return;
    }

    if (window.innerWidth <= 1024) {
      section.style.setProperty("--scroll-distance", "0px");
      track.style.transform = "translate3d(0px, 0px, 0px)";
      return;
    }

    const visibleWidth = sticky.clientWidth - 40;
    const scrollDistance = Math.max(0, track.scrollWidth - visibleWidth);
    section.style.setProperty("--scroll-distance", `${scrollDistance}px`);
  });
};

const updateHorizontalGalleries = () => {
  horizontalGalleries.forEach((section) => {
    const sticky = section.querySelector(".gallery-sticky");
    const track = section.querySelector(".gallery-track");

    if (!sticky || !track) {
      return;
    }

    if (window.innerWidth <= 1024) {
      track.style.transform = "translate3d(0px, 0px, 0px)";
      return;
    }

    const visibleWidth = sticky.clientWidth - 40;
    const scrollDistance = Math.max(0, track.scrollWidth - visibleWidth);
    const start = section.offsetTop;
    const end = start + section.offsetHeight - window.innerHeight;
    const progress = end <= start ? 0 : (window.scrollY - start) / (end - start);
    const clampedProgress = clamp(progress, 0, 1);
    const x = -scrollDistance * clampedProgress;
    track.style.transform = `translate3d(${x}px, 0px, 0px)`;
  });
};

const updateLayoutEffects = () => {
  updateMarqueeRows();
  updateAnimatedText();
  updateStackCards();
  updateHorizontalGalleries();
};

initMagnet();
initMarqueeRows();
initAnimatedText();
setupHorizontalGalleries();
updateLayoutEffects();

window.addEventListener(
  "resize",
  () => {
    setupHorizontalGalleries();
    updateLayoutEffects();
  },
  { passive: true },
);

window.addEventListener("scroll", updateLayoutEffects, { passive: true });
