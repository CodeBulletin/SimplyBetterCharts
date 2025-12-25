import {
  LineChart,
  BarChart,
  StackedChart,
  BarGraph,
  LineGraph,
} from "../lib/main";

const PointData = [
  { x: 0, y: 10 },
  { x: 1, y: 30 },
  { x: 2, y: 20 },
  { x: 3, y: 40 },
];

const BarData = [
  { label: 0, value: 10 },
  { label: 1, value: 30 },
  { label: 2, value: 20 },
  { label: 3, value: 40 },
];

export default function App() {
  return (
    <>
      <LineChart data={PointData} width={400} height={300} />
      <BarChart data={BarData} width={400} height={300} />
      <StackedChart
        graphs={[BarGraph(BarData), LineGraph(PointData)]}
        width={400}
        height={300}
      ></StackedChart>
    </>
  );
}
