import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header.jsx';
import Tabs from './components/Tabs.jsx';
import CardGrid from './components/CardGrid.jsx';
import IframeStage from './components/IframeStage.jsx';
import EdgeBlur from './components/EdgeBlur.jsx';
import Learnings from './components/Learnings.jsx';
import { projects } from './data/projects.js';
import styles from './App.module.css';

const tabPanelVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const tabPanelTransition = { duration: 0.32, ease: [0.22, 1, 0.36, 1] };

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [rects, setRects] = useState({});
  const [currentTab, setCurrentTab] = useState('work');
  const [iframesVisible, setIframesVisible] = useState(false);

  // Defer iframe visibility flip until after the Learnings panel finishes
  // exiting (matches AnimatePresence's 0.32s) so the entry animation lands
  // on a clean stage. Exits flip immediately.
  useEffect(() => {
    if (currentTab === 'work') {
      const id = setTimeout(() => setIframesVisible(true), 320);
      return () => clearTimeout(id);
    }
    setIframesVisible(false);
  }, [currentTab]);

  const reportRect = useCallback((id, rect) => {
    setRects((prev) => {
      const cur = prev[id];
      if (cur && cur.top === rect.top && cur.left === rect.left && cur.width === rect.width && cur.height === rect.height) {
        return prev;
      }
      return { ...prev, [id]: rect };
    });
  }, []);

  const handleTabChange = useCallback((tab) => {
    setSelectedId(null);
    setCurrentTab(tab);
  }, []);

  return (
    <div className={styles.shell}>
      <Header />
      <Tabs current={currentTab} onChange={handleTabChange} />
      <main className={styles.main}>
        <AnimatePresence mode="wait">
          {currentTab === 'work' && (
            <motion.div
              key="work"
              variants={tabPanelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={tabPanelTransition}
            >
              <CardGrid projects={projects} reportRect={reportRect} />
            </motion.div>
          )}
          {currentTab === 'learnings' && (
            <motion.div
              key="learnings"
              variants={tabPanelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={tabPanelTransition}
            >
              <Learnings />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <IframeStage
        projects={projects}
        rects={rects}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onClose={() => setSelectedId(null)}
        visible={iframesVisible}
      />
      <EdgeBlur />
    </div>
  );
}
