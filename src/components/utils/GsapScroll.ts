import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ============================================================
//  🎮  3D CHARACTER VISIBILITY CONFIG
//  Change these to control when the character shows/hides
// ============================================================
const CHARACTER_CONFIG = {
  showOnLanding: true,
  showOnAbout:   true,
  showOnCareer:  false,
  showOnWork:    false,
  showOnSkills:  false,
  showOnContact: false,
  fadeOutDuration: 0.8,
  exitY: "-15%",
};
// ============================================================

function setCharVisible(visible: boolean) {
  gsap.set(".character-model", {
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? "inherit" : "none",
  });
}

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  if (!character) return;

  if (!CHARACTER_CONFIG.showOnLanding) {
    setCharVisible(false);
    return;
  }

  // ── Screen objects (prefix with _ to mark intentionally unused) ──
  let _screenLight: any = null;
  let _monitor: any = null;

  character.children.forEach((object: any) => {
    if (object.name === "Plane004") {
      object.children.forEach((child: any) => {
        child.material.transparent = true;
        child.material.opacity = 0;
        if (child.material.name === "Material.018") {
          _monitor = child;
          child.material.color.set("#FFFFFF");
        }
      });
    }
    if (object.name === "screenlight") {
      object.material.transparent = true;
      object.material.opacity = 0;
      _screenLight = object;
    }
  });

  // suppress unused warning
  void _monitor;
  void _screenLight;

  const neckBone = character.getObjectByName("spine005");

  if (window.innerWidth > 1024) {

    // ── TL1: Landing scrolls away ──
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

    // ── TL2: About ends → character exits ──
    if (!CHARACTER_CONFIG.showOnAbout || !CHARACTER_CONFIG.showOnCareer) {
      const exitTrigger = !CHARACTER_CONFIG.showOnAbout
        ? ".about-section"
        : ".career-section";

      gsap.timeline({
        scrollTrigger: {
          trigger: exitTrigger,
          start: !CHARACTER_CONFIG.showOnAbout ? "top 60%" : "top 90%",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true,
          onLeave: () => setCharVisible(false),
          onEnterBack: () => {
            if (CHARACTER_CONFIG.showOnAbout) setCharVisible(true);
          },
        },
      }).to(".character-model", {
        opacity: 0,
        y: CHARACTER_CONFIG.exitY,
        duration: 1,
        ease: "power2.in",
      }, 0)
        .to(".about-section", { opacity: 0, duration: 0.5 }, 0.5)
        .to(character.rotation, { y: 1.0, duration: 1 }, 0);
    }

    // ── Section toggles ──
    const sectionToggles: { selector: string; show: boolean }[] = [
      { selector: ".career-section",  show: CHARACTER_CONFIG.showOnCareer },
      { selector: ".work-section",    show: CHARACTER_CONFIG.showOnWork },
      { selector: ".skills-section",  show: CHARACTER_CONFIG.showOnSkills },
      { selector: ".contact-section", show: CHARACTER_CONFIG.showOnContact },
    ];

    sectionToggles.forEach(({ selector, show }) => {
      ScrollTrigger.create({
        trigger: selector,
        start: "top 80%",
        onEnter: () => { if (!show) setCharVisible(false); },
        onEnterBack: () => { if (show) setCharVisible(true); else setCharVisible(false); },
      });
    });

  } else {
    // ── Mobile ──
    ScrollTrigger.create({
      trigger: ".about-section",
      start: "bottom 70%",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const model = document.querySelector(".character-model") as HTMLElement;
        if (model) model.style.opacity = String(1 - self.progress);
      },
      onLeave: () => setCharVisible(false),
      onEnterBack: () => {
        if (CHARACTER_CONFIG.showOnAbout) setCharVisible(true);
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