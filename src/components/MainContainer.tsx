import { lazy, PropsWithChildren, Suspense, useEffect, useRef, useState } from "react";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import setSplitText from "./utils/splitText";

// ── Lazy load all below-fold sections ──
const About   = lazy(() => import("./About"));   // About
const Career  = lazy(() => import("./Career"));  // Work Experience
const Work    = lazy(() => import("./Work"));    // Projects
const Skills  = lazy(() => import("./Skills"));  // Skills
const Contact = lazy(() => import("./Contact")); // Contact

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );
  const resizeTimer = useRef<number>();

  useEffect(() => {
    const resizeHandler = () => {
      clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(() => {
        setSplitText();
        setIsDesktopView(window.innerWidth > 1024);
      }, 150);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler, { passive: true });
    return () => {
      window.removeEventListener("resize", resizeHandler);
      clearTimeout(resizeTimer.current);
    };
  }, []);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            {/* 1. Home */}
            <Landing>{!isDesktopView && children}</Landing>
            <Suspense fallback={null}>
              {/* 2. About */}
              <About />
              {/* 3. Work Experience */}
              <Career />
              {/* 4. Projects */}
              <Work />
              {/* 5. Skills */}
              <Skills />
              {/* 6. Contact */}
              <Contact />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
