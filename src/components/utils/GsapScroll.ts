import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  if (!character) return;

  let intensity = 0;
  const flickerInterval = setInterval(() => { intensity = Math.random(); }, 200);
  (window as any).__flickerInterval = flickerInterval;

  let screenLight: any = null;
  let monitor: any = null;

  character.children.forEach((object: any) => {
    if (object.name === "Plane004") {
      object.children.forEach((child: any) => {
        child.material.transparent = true;
        child.material.opacity = 0; // keep monitor hidden always
        if (child.material.name === "Material.018") {
          monitor = child;
          child.material.color.set("#FFFFFF");
        }
      });
    }
    if (object.name === "screenlight") {
      object.material.transparent = true;
      object.material.opacity = 0; // keep screen light hidden
      screenLight = object;
    }
  });

  const neckBone = character.getObjectByName("spine005");

  if (window.innerWidth > 1024) {

    // ── TL1: Landing scrolls away → character shifts LEFT, about slides in ──
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
      .fromTo(".about-me", { y: "-30%", opacity: 0 }, { y: "0%", opacity: 1, duration: 0.6 }, 0.4)
      .fromTo(".character-rim",
        { opacity: 1, scaleX: 1.4 },
        { opacity: 0, scale: 0, y: "-70%", duration: 0.8 }, 0.2
      );

    if (neckBone) tl1.to(neckBone.rotation, { x: 0.2, duration: 0.8 }, 0);

    // ── TL2: About ends → character fades out cleanly ──
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".about-section",
        start: "bottom 70%",
        end: "bottom top",
        scrub: 1,
        invalidateOnRefresh: true,
        onLeave: () => {
          gsap.set(".character-model", { opacity: 0, pointerEvents: "none" });
        },
        onEnterBack: () => {
          gsap.set(".character-model", { opacity: 1, pointerEvents: "inherit" });
        },
      },
    });

    tl2
      .to(".character-model", { opacity: 0, y: "-15%", duration: 1, ease: "power2.in" }, 0)
      .to(".about-section", { opacity: 0, duration: 0.5 }, 0.5)
      .to(character.rotation, { y: 1.0, duration: 1 }, 0);

  } else {
    // ── Mobile: fade out as about scrolls past ──
    ScrollTrigger.create({
      trigger: ".about-section",
      start: "bottom 70%",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const model = document.querySelector(".character-model") as HTMLElement;
        if (model) model.style.opacity = String(1 - self.progress);
      },
      onLeave: () => {
        const model = document.querySelector(".character-model") as HTMLElement;
        if (model) { model.style.opacity = "0"; model.style.pointerEvents = "none"; }
      },
      onEnterBack: () => {
        const model = document.querySelector(".character-model") as HTMLElement;
        if (model) { model.style.opacity = "1"; model.style.pointerEvents = "inherit"; }
      },
    });
  }
}

export function setAllTimeline() {
  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 100%",
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