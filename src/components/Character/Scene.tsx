import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  useEffect(() => {
    if (!canvasDiv.current) return;

    const rect = canvasDiv.current.getBoundingClientRect();
    const container = { width: rect.width, height: rect.height };
    const aspect = container.width / container.height;
    const scene = sceneRef.current;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio < 2,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.sortObjects = false;
    canvasDiv.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    let headBone: THREE.Object3D | null = null;
    let screenLight: any | null = null;
    let mixer: THREE.AnimationMixer;
    let animFrameId: number;
    let isPageVisible = true;
    let frameCount = 0;

    const clock = new THREE.Clock();
    const light = setLighting(scene);
    const progress = setProgress((value) => setLoading(value));
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    loadCharacter().then((gltf) => {
      if (!gltf) return;

      const animations = setAnimations(gltf);
      if (hoverDivRef.current) animations.hover(gltf, hoverDivRef.current);
      mixer = animations.mixer;

      const character = gltf.scene;
      // ── Add to scene while still invisible ──
      scene.add(character);

      headBone = character.getObjectByName("spine006") || null;
      screenLight = character.getObjectByName("screenlight") || null;

      // ── Tick mixer once more after scene.add() so all bones are baked ──
      mixer.update(0.001);

      // ── Reveal character only after 2 render frames have completed ──
      // This guarantees the GPU has drawn the correct posed frame first
      frameCount = 0;
      const revealAfterFrames = () => {
        frameCount++;
        if (frameCount >= 2) {
          animations.revealCharacter();
        }
      };
      // Store reveal callback so animate loop can call it
      (renderer as any).__revealCb = revealAfterFrames;

      progress.loaded().then(() => {
        setTimeout(() => {
          light.turnOnLights();
          animations.startIntro();
        }, 2500);
      });

      window.addEventListener("resize", resizeHandler);
    });

    // ── Throttled mousemove ──
    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };
    let lastMouseTime = 0;
    const onMouseMove = (event: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseTime < 16) return;
      lastMouseTime = now;
      handleMouseMove(event, (x, y) => { mouse = { x, y }; });
    };

    // ── Debounced resize ──
    let resizeTimer: number;
    const resizeHandler = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        handleResize(renderer, camera, canvasDiv, scene.children[0] as THREE.Object3D);
      }, 150);
    };

    // ── Touch ──
    let debounce: number | undefined;
    const onTouchStart = (event: TouchEvent) => {
      const element = event.target as HTMLElement;
      debounce = setTimeout(() => {
        element?.addEventListener("touchmove", (e: TouchEvent) =>
          handleTouchMove(e, (x, y) => { mouse = { x, y }; })
        );
      }, 200);
    };
    const onTouchEnd = () => {
      handleTouchEnd((x, y, ix, iy) => {
        mouse = { x, y };
        interpolation = { x: ix, y: iy };
      });
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    const landingDiv = document.getElementById("landingDiv");
    if (landingDiv) {
      landingDiv.addEventListener("touchstart", onTouchStart, { passive: true });
      landingDiv.addEventListener("touchend", onTouchEnd, { passive: true });
    }

    // ── Pause when tab hidden ──
    const onVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) clock.start();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // ── Render loop ──
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      if (!isPageVisible) return;

      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);

      if (headBone) {
        handleHeadRotation(
          headBone, mouse.x, mouse.y,
          interpolation.x, interpolation.y,
          THREE.MathUtils.lerp
        );
        if (screenLight) light.setPointLight(screenLight);
      }

      // ── Render first, THEN reveal — ensures posed frame is drawn ──
      renderer.render(scene, camera);

      const revealCb = (renderer as any).__revealCb;
      if (revealCb) {
        revealCb();
        if (frameCount >= 2) {
          delete (renderer as any).__revealCb;
        }
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      clearTimeout(debounce);
      clearTimeout(resizeTimer);
      scene.clear();
      renderer.dispose();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", resizeHandler);
      if (canvasDiv.current?.contains(renderer.domElement)) {
        canvasDiv.current.removeChild(renderer.domElement);
      }
      if (landingDiv) {
        landingDiv.removeEventListener("touchstart", onTouchStart);
        landingDiv.removeEventListener("touchend", onTouchEnd);
      }
    };
  }, []);

  return (
    <div className="character-container">
      <div className="character-model" ref={canvasDiv}>
        <div className="character-rim"></div>
        <div className="character-hover" ref={hoverDivRef}></div>
      </div>
    </div>
  );
};

export default Scene;
