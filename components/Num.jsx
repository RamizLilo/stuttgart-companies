"use client";
import { useEffect, useRef, useState } from "react";

// Counts up (or down) to a new value. No animation on first load or when reduced motion is on.
export function useCountUp(value, ms = 600) {
  const [shown, setShown] = useState(value);
  const last = useRef(value);
  useEffect(() => {
    const target = value;
    const from = last.current;
    const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (target == null || from == null || Number.isNaN(target) || Number.isNaN(from) || reduce || from === target) {
      last.current = target; setShown(target); return;
    }
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / ms);
      const v = from + (target - from) * (1 - Math.pow(1 - p, 3));
      last.current = v; setShown(v);
      if (p < 1) raf = requestAnimationFrame(tick); else last.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return shown;
}

// <Num value={12.3} format={fmt.bn} na="n/a" />
export default function Num({ value, format, na = "n/a" }) {
  const v = useCountUp(value);
  return <>{value == null ? na : format(v)}</>;
}
