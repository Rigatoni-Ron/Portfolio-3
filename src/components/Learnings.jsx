import styles from './Learnings.module.css';

const COURSES = [
  {
    title: 'Interface Craft',
    url: 'https://www.interfacecraft.dev/',
    host: 'interfacecraft.dev',
  },
  {
    title: 'Design Engineering',
    url: 'https://www.designengineer.xyz/design-engineering',
    host: 'designengineer.xyz',
  },
];

const PODCASTS = [
  {
    title: 'Dive Club',
    url: 'https://www.youtube.com/@joindiveclub',
    host: 'youtube.com/@joindiveclub',
  },
  {
    title: 'Designer Tom',
    url: 'https://www.youtube.com/@designertom',
    host: 'youtube.com/@designertom',
  },
  {
    title: "Lenny's Podcast",
    url: 'https://www.youtube.com/@LennysPodcast',
    host: 'youtube.com/@LennysPodcast',
  },
  {
    title: 'Ryan Peterman',
    url: 'https://www.youtube.com/@RyanLPeterman',
    host: 'youtube.com/@RyanLPeterman',
  },
];

function LinkCard({ item }) {
  return (
    <a href={item.url} target="_blank" rel="noreferrer" className={styles.linkCard}>
      <span className={styles.linkTitle}>{item.title}</span>
      <span className={styles.linkHost}>{item.host}</span>
    </a>
  );
}

export default function Learnings() {
  return (
    <section className={styles.section}>
      <div className={styles.block}>
        <h2 className={styles.heading}>Github contributions</h2>
        <a
          href="https://github.com/Rigatoni-Ron"
          target="_blank"
          rel="noreferrer"
          className={styles.chart}
        >
          <img
            src="https://ghchart.rshah.org/c97a3e/Rigatoni-Ron"
            alt="GitHub contribution chart for Rigatoni-Ron"
            className={styles.chartImg}
          />
          <span className={styles.chartFooter}>github.com/Rigatoni-Ron</span>
        </a>
      </div>

      <div className={styles.block}>
        <h2 className={styles.heading}>Courses</h2>
        <div className={styles.grid}>
          {COURSES.map((course) => (
            <LinkCard key={course.url} item={course} />
          ))}
        </div>
      </div>

      <div className={styles.block}>
        <h2 className={styles.heading}>Podcasts</h2>
        <div className={styles.grid}>
          {PODCASTS.map((podcast) => (
            <LinkCard key={podcast.url} item={podcast} />
          ))}
        </div>
      </div>
    </section>
  );
}
