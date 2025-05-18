const btns = document.querySelectorAll(".btn");
const slideRow = document.getElementById("slide-row");
const main = document.querySelector("main");

let currentIndex = 0;

function updateSlide() {
  const mainWidth = main.offsetWidth;
  const translateValue = currentIndex * -mainWidth;

  slideRow.style.transition = "transform 0.8s ease-in-out";
  slideRow.style.transform = `translateX(${translateValue}px)`;

  slideRow.removeEventListener("transitionend", handleTransitionEnd);
  slideRow.addEventListener("transitionend", handleTransitionEnd);

  btns.forEach((btn, index) => {
    btn.classList.toggle("active", index === currentIndex);
  });
}

function handleTransitionEnd(e) {
  if (e.propertyName === "transform") {
    animateActiveSlide();
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


// 🔄 DRAG & SWIPE SUPPORT (Web + Mobile)
let startX = 0;
let isDragging = false;
const threshold = 50; // px to trigger change

function onDragStart(e) {
  isDragging = true;
  startX = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
}

function onDragMove(e) {
  if (!isDragging) return;
  const x = e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
  const deltaX = x - startX;

  slideRow.style.transition = "none";
  slideRow.style.transform = `translateX(${(-main.offsetWidth * currentIndex) + deltaX}px)`;
}

function onDragEnd(e) {
  if (!isDragging) return;
  isDragging = false;

  const endX = e.type.includes("mouse") ? e.pageX : e.changedTouches[0].pageX;
  const deltaX = endX - startX;

  if (deltaX > threshold && currentIndex > 0) {
    currentIndex--;
  } else if (deltaX < -threshold && currentIndex < btns.length - 1) {
    currentIndex++;
  }

  updateSlide();
}

// 👇 Attach events to the main area
main.addEventListener("mousedown", onDragStart);
main.addEventListener("mousemove", onDragMove);
main.addEventListener("mouseup", onDragEnd);
main.addEventListener("mouseleave", onDragEnd);

main.addEventListener("touchstart", onDragStart, { passive: true });
main.addEventListener("touchmove", onDragMove, { passive: true });
main.addEventListener("touchend", onDragEnd);
