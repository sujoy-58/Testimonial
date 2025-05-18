const btns = document.querySelectorAll(".btn");
const slideRow = document.getElementById("slide-row");
const main = document.querySelector("main");

let currentIndex = 0;

function updateSlide() {
  const mainWidth = main.offsetWidth;
  const translateValue = currentIndex * -mainWidth;

  // Apply transform with transition
  slideRow.style.transition = "transform 0.8s ease-in-out";
  slideRow.style.transform = `translateX(${translateValue}px)`;

  // Remove any old transitionend handlers
  slideRow.removeEventListener("transitionend", handleTransitionEnd);
  // Add a new one for this transition
  slideRow.addEventListener("transitionend", handleTransitionEnd);

  // Update active dot
  btns.forEach((btn, index) => {
    btn.classList.toggle("active", index === currentIndex);
  });
}

function handleTransitionEnd(e) {
  if (e.propertyName === "transform") {
    animateActiveSlide();
    // Remove listener after firing once
    slideRow.removeEventListener("transitionend", handleTransitionEnd);
  }
}

function animateActiveSlide() {
  const slides = document.querySelectorAll(".slide-col");

  slides.forEach((slide, index) => {
    const content = slide.querySelector(".content");
    const image = slide.querySelector("img");

    if (index === currentIndex) {
        gsap.set(content, { x: -40, opacity: 0 });
      gsap.set(image, { scale: 1.06, opacity: 0 });

      gsap.timeline()
        .to(content, {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: "power3.out"
        }, 0)
        .to(image, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power3.out"
        }, 0.1);
    } else {
      gsap.set([content, image], { opacity: 0 });
    }
  });
}

btns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (currentIndex !== index) {
      currentIndex = index;
      updateSlide();
    }
  });
});

window.addEventListener("resize", updateSlide);

document.getElementById("year").textContent = new Date().getFullYear();
