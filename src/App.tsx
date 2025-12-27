import { useEffect, useState } from "react";
import {
  LineChart,
  BarChart,
  StackedChart,
  BarGraph,
  LineGraph,
} from "../lib/main";

/* --------------------------------
   TYPES
--------------------------------- */
type LinePoint = { x: number | string; y: number };
type BarPoint = { label: string; value: number };

/* --------------------------------
   HELPERS
--------------------------------- */
function random(min = -50, max = 50) {
  return Math.round(min + Math.random() * (max - min));
}

/* --------------------------------
   APP
--------------------------------- */
export default function App() {
  /* ---------- dynamic numeric line ---------- */
  const [numericLine, setNumericLine] = useState<LinePoint[]>([
    { x: 0, y: 10 },
    { x: 1, y: 25 },
    { x: 2, y: 15 },
  ]);

  /* ---------- dynamic categorical line ---------- */
  const [categoryLine, setCategoryLine] = useState<LinePoint[]>([
    { x: "A", y: 12 },
    { x: "B", y: 28 },
    { x: "C", y: 18 },
  ]);

  const [categoryLine2, setCategoryLine2] = useState<LinePoint[]>([
    { x: "A", y: 10 },
    { x: "B", y: 30 },
    { x: "C", y: 20 },
  ]);

  /* ---------- dynamic bars ---------- */
  const [bars, setBars] = useState<BarPoint[]>([
    { label: "A", value: 10 },
    { label: "B", value: 30 },
    { label: "C", value: 20 },
  ]);

  /* --------------------------------
     DYNAMIC UPDATE LOOP
  --------------------------------- */
  useEffect(() => {
    const id = setInterval(() => {
      setNumericLine((prev) => [...prev, { x: prev.length, y: random() }]);

      setCategoryLine((prev) => {
        const nextLabel = String.fromCharCode(65 + prev.length);
        return [...prev, { x: nextLabel, y: random() }];
      });

      const y = random();
      setBars((prev) => {
        const nextLabel = String.fromCharCode(65 + prev.length);
        return [...prev, { label: nextLabel, value: y }];
      });

      setCategoryLine2((prev) => {
        const nextLabel = String.fromCharCode(65 + prev.length);
        return [...prev, { x: nextLabel, y: y }];
      });
    }, 1500);

    return () => clearInterval(id);
  }, []);

  /* --------------------------------
     RENDER
  --------------------------------- */
  return (
    <div style={{ display: "grid", gap: 32 }}>
      {/* ---------- LIVE LINE (LINEAR) ---------- */}
      <section>
        <h3>Live LineChart – Numeric X</h3>
        <LineChart data={numericLine} width={500} height={300} />
      </section>

      {/* ---------- LIVE LINE (CATEGORICAL) ---------- */}
      <section>
        <h3>Live LineChart – Categorical X</h3>
        <LineChart data={categoryLine} width={500} height={300} />
      </section>

      {/* ---------- LIVE BAR ---------- */}
      <section>
        <h3>Live BarChart</h3>
        <BarChart data={bars} width={500} height={300} />
      </section>

      {/* ---------- LIVE STACKED ---------- */}
      <section>
        <h3>Live StackedChart (Bar + Line)</h3>
        <StackedChart
          width={500}
          height={300}
          graphs={[BarGraph(bars), LineGraph(categoryLine2)]}
        />
      </section>
    </div>
  );
}
