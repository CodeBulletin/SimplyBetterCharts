import { useEffect, useMemo, useState } from "react";
import { LineChart, CompositeChart, BarChart } from "../lib/main";

/* --------------------------------
   HELPERS
--------------------------------- */
function random(min = -50, max = 50) {
  return Math.round(min + Math.random() * (max - min));
}

function nextLabel(i: number) {
  return String.fromCharCode(65 + i);
}

/* --------------------------------
   APP
--------------------------------- */
export default function App() {
  /* ---------- DATA ---------- */
  const [bars, setBars] = useState([{ label: "A", value: 10 }]);

  const [lineA, setLineA] = useState([{ x: "A", y: 10 }]);

  const [lineB, setLineB] = useState([{ x: "A", y: 10 }]);

  /* ---------- VISIBILITY TOGGLES ---------- */
  const [showLineA, setShowLineA] = useState(true);
  const [showLineB, setShowLineB] = useState(false);
  const [showThreshold, setShowThreshold] = useState(false);

  /* ---------- LIVE DATA UPDATE ---------- */
  useEffect(() => {
    const id = setInterval(() => {
      const y = random();

      setBars((prev) => [...prev, { label: nextLabel(prev.length), value: y }]);

      setLineA((prev) => [...prev, { x: nextLabel(prev.length), y: y }]);

      setLineB((prev) => [...prev, { x: nextLabel(prev.length), y: random() }]);
    }, 1500);

    return () => clearInterval(id);
  }, []);

  /* --------------------------------
     COMPOSITE LAYERS (DYNAMIC)
  --------------------------------- */
  const compositeLayers = useMemo(() => {
    const layers: any[] = [];

    // Bars are always present
    layers.push({
      id: "bars",
      type: "bar",
      data: bars,
      zIndex: 10,
    });

    // Optional Line A
    if (showLineA) {
      layers.push({
        id: "line-a",
        type: "line",
        data: lineA,
        zIndex: 20,
      });
    }

    // Optional Line B
    if (showLineB) {
      layers.push({
        id: "line-b",
        type: "line",
        data: lineB,
        zIndex: 30,
      });
    }

    return layers;
  }, [bars, lineA, lineB, showLineA, showLineB, showThreshold]);

  /* --------------------------------
     UI
  --------------------------------- */
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <h2>Dynamic CompositeChart</h2>

      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={() => setShowLineA((v) => !v)}>Toggle Line A</button>
        <button onClick={() => setShowLineB((v) => !v)}>Toggle Line B</button>
        <button onClick={() => setShowThreshold((v) => !v)}>
          Toggle Threshold
        </button>
      </div>

      <CompositeChart width={600} height={350} layers={compositeLayers} />

      <hr />

      {/* Independent charts still work */}
      <section>
        <h3>Independent Charts</h3>
        <LineChart data={lineA} />
        <BarChart data={bars} />
      </section>
    </div>
  );
}
