// A tiny line that shows the development over the years. Missing years are skipped.
export default function Spark({ values, color = "#334155", width = 84, height = 26 }) {
  const pts = values.map((v, i) => (v == null ? null : [i, v])).filter(Boolean);
  if (pts.length < 2) return <span className="inline-block" style={{ width, height }} aria-hidden />;
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const sx = (x) => 3 + ((x - x0) / (x1 - x0 || 1)) * (width - 6);
  const sy = (y) => height - 3 - ((y - y0) / (y1 - y0 || 1)) * (height - 6);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${sx(p[0]).toFixed(1)} ${sy(p[1]).toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden className="shrink-0">
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={sx(last[0])} cy={sy(last[1])} r="2.8" fill={color} />
    </svg>
  );
}
