import ProjectCard from './ProjectCard.jsx';
import styles from './CardGrid.module.css';

export default function CardGrid({ projects, reportRect }) {
  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} reportRect={reportRect} />
      ))}
    </div>
  );
}
