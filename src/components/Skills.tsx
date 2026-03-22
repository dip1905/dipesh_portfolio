import "./styles/Skills.css";

const skills = {
  Languages: ["Java", "JavaScript", "TypeScript"],
  Backend: ["Spring Boot", "Node.js", "Express.js", "REST APIs"],
  Frontend: ["React.js", "Next.js", "HTML", "CSS", "TailwindCSS"],
  Database: ["MySQL", "MongoDB", "PostgreSQL", "Prisma ORM"],
  Tools: ["Git", "GitHub", "Postman", "Docker"],
};

const Skills = () => {
  return (
    <div className="skills-section section-container" id="skills">
      <h2 className="skills-title">
        My <span>Skills</span>
      </h2>
      <div className="skills-grid">
        {Object.entries(skills).map(([category, items]) => (
          <div className="skills-card" key={category}>
            <h3>{category}</h3>
            <div className="skills-tags">
              {items.map((skill) => (
                <span className="skill-tag" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
