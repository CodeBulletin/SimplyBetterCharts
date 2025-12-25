// src/react/Tooltip.tsx

type TooltipProps = {
  x: number;
  y: number;
  value: number;
};

export function Tooltip({ x, y, value }: TooltipProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: x + 8,
        top: y + 8,
        background: "black",
        color: "white",
        padding: "4px 6px",
        fontSize: 12,
        pointerEvents: "none",
      }}
    >
      {value}
    </div>
  );
}
