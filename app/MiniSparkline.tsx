"use client";

interface MiniSparklineProps {
  data: number[];
  width?: number;
  height?: number;
}

export default function MiniSparkline({ data, width = 60, height = 20 }: MiniSparklineProps) {
  if (!data || data.length === 0) {
    return <div style={{ width, height }} className="bg-white/5 rounded" />;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-400"
      />
    </svg>
  );
}
