import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { TbNotes } from "react-icons/tb";
import { MdOutlineEmail } from "react-icons/md";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const Navbar = () => {
  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.2,       // reduced from 1.7 — less layout distortion
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
      // ── NO speed multiplier — was stretching page height incorrectly ──
      // ── NOT paused — page scrolls immediately ──
    });

    smoother.scrollTop(0);

    document.querySelectorAll(".header ul a").forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          const section = (e.currentTarget as HTMLAnchorElement).getAttribute("data-href");
          smoother.scrollTo(section, true, "top top");
        }
      });
    });

    window.addEventListener("resize", () => ScrollSmoother.refresh(true), { passive: true });
  }, []);

  return (
    <>
      <div className="header">
        <div className="navbar-left">
          <a href="/#" className="navbar-title" data-cursor="disable">
            DP
          </a>
          <div className="navbar-left-actions">
            <a
              href="mailto:dipesh.patel9977@gmail.com"
              className="navbar-email"
              data-cursor="disable"
            >
              <MdOutlineEmail />
              <span>dipesh.patel9977@gmail.com</span>
            </a>
            <a
              href="/Dipesh_Patel.pdf"
              download
              className="navbar-resume"
              data-cursor="disable"
            >
              <TbNotes />
              <span>Resume</span>
            </a>
          </div>
        </div>

        <ul>
          <li><a data-href="#about" href="#about"><HoverLinks text="ABOUT" /></a></li>
          <li><a data-href="#experience" href="#experience"><HoverLinks text="EXPERIENCE" /></a></li>
          <li><a data-href="#work" href="#work"><HoverLinks text="PROJECTS" /></a></li>
          <li><a data-href="#skills" href="#skills"><HoverLinks text="SKILLS" /></a></li>
          <li><a data-href="#contact" href="#contact"><HoverLinks text="CONTACT" /></a></li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
