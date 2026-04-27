import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './IframeStage.module.css';

const DESIGN_W = 1280;
const DESIGN_H = 800;

const morphTransition = {
  type: 'spring',
  stiffness: 420,
  damping: 38,
  mass: 0.7,
};

const visibilityTransition = { duration: 0.32, ease: [0.22, 1, 0.36, 1] };

function useViewport() {
  const [vp, setVp] = useState(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1280,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));
  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return vp;
}

export default function IframeStage({ projects, rects, selectedId, onSelect, onClose, visible = true }) {
  const vp = useViewport();

  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, onClose]);

  return (
    <div className={styles.stage}>
      <AnimatePresence>
        {visible && selectedId && (
          <motion.div
            key="backdrop"
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {projects.map((project) => {
        const rect = rects[project.id];
        const isSelected = selectedId === project.id;
        const isOtherSelected = selectedId && !isSelected;

        if (!rect) return null;

        const target = isSelected
          ? { top: 0, left: 0, width: vp.w, height: vp.h, borderRadius: 0 }
          : { top: rect.top, left: rect.left, width: rect.width, height: rect.height, borderRadius: 12 };

        const iframeScale = isSelected
          ? Math.max(vp.w / DESIGN_W, vp.h / DESIGN_H)
          : rect.width / DESIGN_W;

        return (
          <motion.div
            key={project.id}
            className={`${styles.frame} ${isSelected ? styles.selected : ''}`}
            onClick={() => visible && !isSelected && onSelect(project.id)}
            initial={{ opacity: 0, y: 12 }}
            animate={{
              ...target,
              opacity: !visible ? 0 : (isOtherSelected ? 0 : 1),
              y: visible ? 0 : 12,
            }}
            transition={{
              default: morphTransition,
              opacity: { ...visibilityTransition, delay: visible ? 0.32 : 0 },
              y: { ...visibilityTransition, delay: visible ? 0.32 : 0 },
            }}
            whileHover={visible && !selectedId ? { y: -4 } : undefined}
            style={{
              background: project.canvasBg,
              zIndex: isSelected ? 60 : 10,
              pointerEvents: !visible || isOtherSelected ? 'none' : 'auto',
              cursor: isSelected ? 'default' : 'pointer',
            }}
          >
            <motion.iframe
              src={project.iframeSrc}
              title={project.title}
              className={styles.iframe}
              style={{
                width: DESIGN_W,
                height: DESIGN_H,
                pointerEvents: isSelected ? 'auto' : 'none',
              }}
              animate={{ scale: iframeScale }}
              transition={morphTransition}
            />
            <AnimatePresence>
              {isSelected && (
                <motion.button
                  className={styles.close}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.18, delay: 0.12 }}
                  aria-label="Close project"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M4 4 L14 14 M14 4 L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
