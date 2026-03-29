import "./styles/Work.css";
import { MdArrowOutward } from "react-icons/md";
import { FaGithub } from "react-icons/fa6";
import WorkImage from "./WorkImage";

const projects = [
  {
    title: "Product Inventory Manager",
    images: [
      "/images/inventory/inventory1.png",
      "/images/inventory/inventory2.png",
      "/images/inventory/inventory3.png",
    ],
    category: "Full Stack – Java",
    tools: ["Java", "Spring Boot", "React.js", "MySQL"],
    description:
      "A full-stack inventory management system with real-time stock tracking, product CRUD operations, and a clean dashboard UI.",
    link: "https://inventory-management-4j4h.onrender.com",
    github: "https://github.com/dip1905/inventory-management", // ← update repo name
    accent: "#5eead4",
  },
  {
    title: "Desk – Team Productivity Platform",
    images: [
      "/images/desk/desk1.png",
      "/images/desk/desk2.png",
      "/images/desk/desk3.png",
      "/images/desk/desk4.png",
      "/images/desk/desk5.png"
    ],
    category: "Full Stack – MERN",
    tools: ["React.js", "Node.js", "Express", "PostgreSQL", "Prisma"],
    description:
      "An all-in-one productivity platform for teams — task management, notes, and collaboration tools built on the MERN stack.",
    link: "",
    github: "https://github.com/dip1905/desk", // ← update repo name
    accent: "#818cf8",
  },
  {
    title: "Job Application Tracker",
    images: [
      "/images/job/job.png",
      "/images/job/job1.png",
      "/images/job/job2.png",
    ],
    category: "Full Stack – Java",
    tools: ["Java", "Spring Boot", "MySQL", "React.js"],
    description:
      "Track job applications, statuses, interviews and deadlines in one place. Built with Java Spring Boot backend and React frontend.",
    link: "https://job-application-tracker-bj48.onrender.com",
    github: "https://github.com/dip1905/job-application-tracker", // ← update repo name
    accent: "#34d399",
  },
  {
    title: "ClinicIQ – Hospital Appointment System",
    images: [
      "/images/clinic/clinic1.png",
      "/images/clinic/clinic3.png",
      "/images/clinic/clinic4.png",
      "/images/clinic/clinic5.png",
    ],
    category: "Full Stack – MERN",
    tools: ["React.js", "Node.js", "Express.js", "MongoDB"],
    description:
      "A hospital appointment system with patient registration, doctor scheduling, and real-time booking management.",
    link: "https://clinic-iq-hospital-appointment-system.onrender.com",
    github: "https://github.com/dip1905/cliniciq", // ← update repo name
    accent: "#f472b6",
  },
  {
    title: "Business Listing",
    category: "Full Stack – Next.js",
    tools: ["Next.js", "Prisma", "PostgreSQL"],
    description:
      "A business directory platform with listing management, search, and filtering — built with Next.js and Prisma ORM.",
    link: "",
    github: "https://github.com/dip1905/business-listing", // ← update repo name
    accent: "#fb923c",
  },
  {
    title: "Votify – Online Voting System",
    category: "Full Stack – Java",
    tools: ["Java", "Spring Boot", "React.js", "MySQL"],
    description:
      "A secure online voting system with user authentication, real-time vote counting, and admin controls.",
    link: "",
    github: "https://github.com/dip1905/votify", // ← update repo name
    accent: "#38bdf8",
  },
];

const Work = () => {
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>My <span>Work</span></h2>

        <div className="work-list">
          {projects.map((project, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                className={`work-item ${isEven ? "work-item--left" : "work-item--right"}`}
                key={index}
                style={{ "--accent": project.accent } as React.CSSProperties}
              >

                {/* ── VISUAL SIDE: Number + Title (swap with image later) ── */}
                <div className="work-item__visual">
                  {/*
                    TO ADD IMAGE later — replace the div below with:
                    <img src={project.image} alt={project.title} className="work-item__img" />
                  */}
                  {project.images ? (
                    <WorkImage
                      images={project.images}
                      alt={project.title}
                      link={project.link}
                      title={project.title}
                    />
                  ) : (
                    <div className="work-item__placeholder">
                      <div className="work-placeholder__glow" />
                      <span className="work-placeholder__number">0{index + 1}</span>
                      <h3 className="work-placeholder__title">{project.title}</h3>
                    </div>
                  )}
                </div>

                {/* ── INFO SIDE: Description + Stack + Links ── */}
                <div className="work-item__info">
                  <h3 className="work-item__title">{project.title}</h3>
                  <p className="work-item__desc">{project.description}</p>

                  <div className="work-item__tags">
                    {project.tools.map((tool) => (
                      <span key={tool} className="work-item__tag">{tool}</span>
                    ))}
                  </div>

                  <div className="work-item__links">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        className="work-item__btn"
                        data-cursor="disable"
                      >
                        <FaGithub /> GitHub
                      </a>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        className="work-item__btn work-item__btn--accent"
                        data-cursor="disable"
                      >
                        <MdArrowOutward /> Live Demo
                      </a>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Work;
