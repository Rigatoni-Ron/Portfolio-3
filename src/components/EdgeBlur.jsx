import styles from './EdgeBlur.module.css';

export default function EdgeBlur({ hidden = false }) {
  return (
    <div
      className={styles.edge}
      aria-hidden
      style={{ opacity: hidden ? 0 : 1 }}
    />
  );
}
