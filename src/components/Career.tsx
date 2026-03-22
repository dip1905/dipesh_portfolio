import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container" id="experience">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>

          {/* Work Experience */}
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>MERN Stack Intern</h4>
                <h5>Quest Digiflex Pvt. Ltd., Indore</h5>
              </div>
              <h3>2026–Now</h3>
            </div>
            <p>
              Developing full-stack applications using the MERN stack and
              Next.js. Designing REST APIs and integrating frontend with backend
              services. Managing databases using PostgreSQL and Prisma ORM.
              Implementing responsive UI and modern web features. Using Git,
              GitHub, and Postman for collaboration and API testing.
            </p>
          </div>

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Design Engineer</h4>
                <h5>Abhikalp Design Studio, Indore</h5>
              </div>
              <h3>2020–2024</h3>
            </div>
            <p>
              Worked on complex systems requiring structured problem-solving.
              Collaborated with cross-functional teams and followed structured
              workflows. Gained strong documentation and professional project
              experience across multiple EV & automotive CAD projects.
            </p>
          </div>

          {/* Education */}
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>PG-DAC (Advanced Computing)</h4>
                <h5>CDAC, Pune</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Post Graduate Diploma in Advanced Computing. Specialized in Java
              Full Stack, Spring Boot, REST APIs, and backend development with
              hands-on real-world project experience.
            </p>
          </div>

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>BE – Mechanical Engineering</h4>
                <h5>Astral Institute of Technology, Indore</h5>
              </div>
              <h3>2018</h3>
            </div>
            <p>
              Bachelor of Engineering in Mechanical Engineering. Built a strong
              foundation in engineering systems, structured thinking, and
              technical documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
