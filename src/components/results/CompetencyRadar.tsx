"use client";
import { SECTIONS } from "../../data/questions";
import { BENCHMARK_SCORES } from "@/lib/scoring";

interface CompetencyRadarProps {
  scores: Record<string, number>;
  showBenchmark?: boolean;
  size?: number;
}

export default function CompetencyRadar({
  scores,
  showBenchmark = true,
  size = 400,
}: CompetencyRadarProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const levels = 5;
  const sections = SECTIONS.map((s) => s.key);
  const labels = SECTIONS.map((s) => s.title);
  const n = sections.length;

  const getPoint = (index: number, value: number): [number, number] => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const r = (value / 100) * radius;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  const polygon = (values: Record<string, number>): string => {
    return sections
      .map((key, i) => {
        const [x, y] = getPoint(i, values[key] || 0);
        return `${x},${y}`;
      })
      .join(" ");
  };

  const splitLabel = (label: string): string[] => {
    const words = label.split(" ");
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      if (current.length === 0) {
        current = word;
      } else if ((current + " " + word).length <= 12) {
        current += " " + word;
      } else {
        lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
    return lines;
  };

  const getLabelPos = (
    index: number
  ): { x: number; y: number; anchor: "start" | "middle" | "end" } => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const r = radius + 40;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    let anchor: "start" | "middle" | "end" = "middle";
    if (Math.cos(angle) < -0.1) anchor = "end";
    else if (Math.cos(angle) > 0.1) anchor = "start";
    return { x, y, anchor };
  };

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className="mx-auto"
    >
      {/* Grid circles */}
      {Array.from({ length: levels }, (_, i) => {
        const r = (radius * (i + 1)) / levels;
        const points = sections
          .map((_, j) => {
            const angle = (Math.PI * 2 * j) / n - Math.PI / 2;
            return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
          })
          .join(" ");
        return (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="#2a3654"
            strokeWidth="1"
          />
        );
      })}
      {/* Axis lines */}
      {sections.map((_, i) => {
        const [x, y] = getPoint(i, 100);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="#2a3654"
            strokeWidth="1"
          />
        );
      })}
      {/* Benchmark polygon */}
      {showBenchmark && (
        <polygon
          points={polygon(BENCHMARK_SCORES)}
          fill="rgba(255, 107, 0, 0.1)"
          stroke="#ff6b00"
          strokeWidth="2"
          strokeDasharray="6 3"
        />
      )}
      {/* User polygon */}
      <polygon
        points={polygon(scores)}
        fill="rgba(201, 168, 76, 0.2)"
        stroke="#c9a84c"
        strokeWidth="2.5"
      />
      {/* User dots */}
      {sections.map((key, i) => {
        const [x, y] = getPoint(i, scores[key] || 0);
        return (
          <circle
            key={key}
            cx={x}
            cy={y}
            r="5"
            fill="#c9a84c"
            stroke="#0a1628"
            strokeWidth="2"
          />
        );
      })}
      {/* Labels */}
      {labels.map((label, i) => {
        const { x, y, anchor } = getLabelPos(i);
        const lines = splitLabel(label);
        const lineHeight = 14;
        const totalHeight = (lines.length - 1) * lineHeight;
        return (
          <text
            key={i}
            textAnchor={anchor}
            style={{ fontFamily: "var(--font-body)", fontSize: "10px", fill: "#9ca3af" }}
          >
            {lines.map((line, li) => (
              <tspan
                key={li}
                x={x}
                y={y - totalHeight / 2 + li * lineHeight}
                dominantBaseline="middle"
              >
                {line}
              </tspan>
            ))}
          </text>
        );
      })}
    </svg>
  );
}
