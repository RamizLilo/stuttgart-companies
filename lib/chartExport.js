// Saves a chart as a PNG image: the SVG of the chart is drawn on a canvas, with a title and a legend.
export async function chartToPng(container, { title, legend = [], filename = "chart.png" }) {
  const svg = container?.querySelector("svg.recharts-surface");
  if (!svg) return false;
  const { width, height } = svg.getBoundingClientRect();
  const clone = svg.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", width);
  clone.setAttribute("height", height);
  clone.setAttribute("font-family", "Arial, Helvetica, sans-serif");
  const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(clone));
  const img = new Image();
  await new Promise((ok, fail) => { img.onload = ok; img.onerror = fail; img.src = url; });

  const scale = 2, pad = 16, head = title ? 34 : 0, foot = legend.length ? 30 : 0;
  const w = Math.round(width + pad * 2), h = Math.round(height + pad * 2 + head + foot);
  const canvas = document.createElement("canvas");
  canvas.width = w * scale; canvas.height = h * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, w, h);
  if (title) { ctx.fillStyle = "#0f172a"; ctx.font = "600 15px Arial, sans-serif"; ctx.fillText(title, pad, pad + 14); }
  ctx.drawImage(img, pad, pad + head, width, height);
  ctx.font = "12px Arial, sans-serif";
  let x = pad;
  legend.forEach((l) => {
    ctx.fillStyle = l.color; ctx.beginPath(); ctx.arc(x + 5, h - pad - 4, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#475569"; ctx.fillText(l.name, x + 16, h - pad);
    x += 16 + ctx.measureText(l.name).width + 18;
  });
  const blob = await new Promise((ok) => canvas.toBlob(ok, "image/png"));
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  return true;
}
