import { useCallback, useState } from 'react';
import Header from './components/Header.jsx';
import CardGrid from './components/CardGrid.jsx';
import IframeStage from './components/IframeStage.jsx';
import { projects } from './data/projects.js';
import styles from './App.module.css';

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [rects, setRects] = useState({});

  const reportRect = useCallback((id, rect) => {
    setRects((prev) => {
      const cur = prev[id];
      if (cur && cur.top === rect.top && cur.left === rect.left && cur.width === rect.width && cur.height === rect.height) {
        return prev;
      }
      return { ...prev, [id]: rect };
    });
  }, []);

  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main}>
        <CardGrid projects={projects} reportRect={reportRect} />
      </main>
      <IframeStage
        projects={projects}
        rects={rects}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
