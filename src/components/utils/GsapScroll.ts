import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CHARACTER_CONFIG = {
  showOnLanding: true,
  showOnAbout:   true,
  showOnCareer:  false,
  showOnWork:    false,
  showOnSkills:  false,
  showOnContact: false,
  exitY: "-15%",
};

function hideChar() {
  const model = document.querySelector(".character-model") as HTMLElement;
  if (model) {
    model.style.opacity = "0";
    model.style.pointerEvents = "none";
    model.style.display = "none"; // fully remove from render
  }
}

function showChar() {
  const model = document.querySelector(".character-model") as HTMLElement;
  if (model) {
    model.style.display = "";
    model.style.opacity = "1";
    model.style.pointerEvents = "inherit";
  }
}

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  if (!character) return;
  if (!CHARACTER_CONFIG.showOnLanding) { hideChar(); return; }

  character.children.forEach((object: any) => {
    if (object.name === "Plane004") {
      object.children.forEach((child: any) => {
        child.material.transparent = true;
        child.material.opacity = 0;
        if (child.material.name === "Material.018") {
          child.material.color.set("#FFFFFF");
        }
      });
    }
    if (object.name === "screenlight") {
      object.material.transparent = true;
      object.material.opacity = 0;
    }
  });

  const neckBone = character.getObjectByName("spine005");

  if (window.innerWidth > 1024) {

    // ── TL1: Landing → character rotates left, about slides in ──
    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: ".landing-section",
        start: "top top",
        end: "bottom top",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    tl1
      .fromTo(character.rotation, { y: 0 }, { y: 0.5, duration: 1 }, 0)
      .to(camera.position, { z: 20 }, 0)
      .fromTo(".character-model", { x: "0%" }, { x: "-28%", duration: 1 }, 0)
      .to(".landing-container", { opacity: 0, duration: 0.4 }, 0)
      .to(".landing-container", { y: "40%", duration: 0.8 }, 0)
      .fromTo(".about-me",
        { y: "-30%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.6 }, 0.4
      )
      .fromTo(".character-rim",
        { opacity: 1, scaleX: 1.4 },
        { opacity: 0, scale: 0, y: "-70%", duration: 0.8 }, 0.2
      );

    if (neckBone) tl1.to(neckBone.rotation, { x: 0.2, duration: 0.8 }, 0);

    // ── Fade about text out as it scrolls away ──
    gsap.timeline({
      scrollTrigger: {
        trigger: ".about-section",
        start: "bottom 80%",
        end: "bottom 20%",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    }).to(".about-section", { opacity: 0, duration: 1 }, 0);

    // ── HIDE CHARACTER: use display:none when career section hits top ──
    ScrollTrigger.create({
      trigger: ".career-section",
      start: "top bottom", // as soon as career enters viewport
      end: "top top",
      scrub: false,
      onEnter: () => {
        // fade out first then hide
        gsap.to(".character-model", {
          opacity: 0,
          y: CHARACTER_CONFIG.exitY,
          duration: 0.5,
          ease: "power2.in",
          onComplete: hideChar,
        });
      },
      onLeaveBack: () => {
        // restore when scrolling back up
        showChar();
        gsap.to(".character-model", {
          opacity: 1,
          y: "0%",
          x: "-28%",
          duration: 0.5,
          ease: "power2.out",
        });
      },
    });

  } else {
    // ── Mobile: hide character when career section enters ──
    ScrollTrigger.create({
      trigger: ".career-section",
      start: "top bottom",
      scrub: false,
      onEnter: () => {
        gsap.to(".character-model", {
          opacity: 0,
          duration: 0.4,
          onComplete: hideChar,
        });
      },
      onLeaveBack: () => {
        showChar();
        gsap.to(".character-model", { opacity: 1, duration: 0.4 });
      },
    });
  }
}

export function setAllTimeline() {
  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 30%",
      end: "100% center",
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  careerTimeline
    .fromTo(".career-timeline", { maxHeight: "10%" }, { maxHeight: "100%", duration: 0.5 }, 0)
    .fromTo(".career-timeline", { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0)
    .fromTo(".career-info-box", { opacity: 0 }, { opacity: 1, stagger: 0.1, duration: 0.5 }, 0)
    .fromTo(".career-dot",
      { animationIterationCount: "infinite" },
      { animationIterationCount: "1", delay: 0.3, duration: 0.1 },
      0
    );
}