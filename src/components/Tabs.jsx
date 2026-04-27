import { motion } from 'framer-motion';
import styles from './Tabs.module.css';

const TABS = [
  { id: 'work', label: 'Work' },
  { id: 'learnings', label: 'Learnings' },
];

export default function Tabs({ current, onChange }) {
  return (
    <nav className={styles.wrap} aria-label="Sections">
      <div className={styles.tabs}>
        {TABS.map((tab) => {
          const active = current === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tab} ${active ? styles.active : ''}`}
              onClick={() => onChange(tab.id)}
              aria-pressed={active}
            >
              {active && (
                <motion.span
                  layoutId="tab-indicator"
                  className={styles.indicator}
                  transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
                />
              )}
              <span className={styles.label}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
