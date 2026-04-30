import { motion } from 'framer-motion';
import styles from './Tabs.module.css';

function PenLineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 20h9" />
      <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </svg>
  );
}

const TABS = [
  { id: 'work', label: 'Ideas', Icon: PenLineIcon },
  { id: 'learnings', label: 'Learnings', Icon: BookOpenIcon },
];

const bouncySpring = {
  type: 'spring',
  stiffness: 480,
  damping: 18,
  mass: 0.9,
};

export default function Tabs({ current, onChange }) {
  return (
    <nav className={styles.wrap} aria-label="Sections">
      <div className={styles.tabs}>
        {TABS.map((tab) => {
          const active = current === tab.id;
          const { Icon } = tab;
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
                  transition={bouncySpring}
                />
              )}
              <motion.span
                className={styles.iconWrap}
                initial={false}
                animate={{
                  width: active ? 18 : 0,
                  opacity: active ? 1 : 0,
                  scale: active ? 1 : 0.4,
                  marginRight: active ? 6 : 0,
                }}
                transition={bouncySpring}
              >
                <Icon />
              </motion.span>
              <span className={styles.label}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
