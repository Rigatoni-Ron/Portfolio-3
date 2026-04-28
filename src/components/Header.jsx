import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Header.module.css';

const TITLE = "Playground";

export default function Header() {
  const [hovering, setHovering] = useState(false);

  return (
    <header className={styles.header}>
      <p className={styles.eyebrow}>Rigatoni Ron's</p>
      <h1
        className={styles.title}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        aria-label={`Rigatoni Ron's ${TITLE}`}
      >
        {TITLE.split('').map((char, i) => (
          <motion.span
            key={i}
            className={styles.letter}
            animate={
              hovering
                ? { y: -18, rotate: i % 2 === 0 ? -4 : 4, scale: 1.04 }
                : { y: 0, rotate: 0, scale: 1 }
            }
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 14,
              delay: hovering ? i * 0.025 : (TITLE.length - i - 1) * 0.012,
            }}
          >
            {char}
          </motion.span>
        ))}
      </h1>
      <p className={styles.sub}>
        A workbench of small experiments, alongside notes on what I'm picking up about frontend.
      </p>
    </header>
  );
}
