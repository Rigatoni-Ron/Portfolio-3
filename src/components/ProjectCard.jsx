import { useEffect, useLayoutEffect, useRef } from 'react';
import styles from './ProjectCard.module.css';

export default function ProjectCard({ project, reportRect }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      reportRect(project.id, { top: r.top, left: r.left, width: r.width, height: r.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [project.id, reportRect]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      reportRect(project.id, { top: r.top, left: r.left, width: r.width, height: r.height });
    });
    return () => cancelAnimationFrame(id);
  }, [project.id, reportRect]);

  return <div ref={ref} className={styles.spacer} aria-hidden />;
}
