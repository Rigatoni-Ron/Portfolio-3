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

const liftSpring = { type: 'spring', stiffness: 420, damping: 22, mass: 0.5 };

const LINE_INITIAL = 'M19 12H5';
const LINE_LOOP = ['M19 12H5', 'M19 12H10', 'M19 12H5'];
const HEAD_INITIAL = 'm12 19-7-7 7-7';
const HEAD_LOOP = ['m12 19-7-7 7-7', 'm15.5 19-7-7 7-7', 'm12 19-7-7 7-7'];
const arrowLoopTransition = { duration: 0.6, ease: 'easeInOut' };

function ExitButton({ onClose }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.button
      className={styles.close}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ duration: 0.18, delay: 0.12 }}
      aria-label="Exit project"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className={styles.closeIcon}
      >
        <motion.path
          d={LINE_INITIAL}
          animate={{ d: hover ? LINE_LOOP : LINE_INITIAL }}
          transition={arrowLoopTransition}
        />
        <motion.path
          d={HEAD_INITIAL}
          animate={{ d: hover ? HEAD_LOOP : HEAD_INITIAL }}
          transition={arrowLoopTransition}
        />
      </svg>
      Exit
    </motion.button>
  );
}

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
              scale: 1,
            }}
            transition={{
              default: morphTransition,
              opacity: visibilityTransition,
              y: liftSpring,
              scale: liftSpring,
            }}
            whileHover={visible && !selectedId ? {
              y: -10,
              scale: 1.018,
            } : undefined}
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
                <ExitButton onClose={onClose} />
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
