"use client";
import { cloneElement } from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, ComposedChart, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Cell, ReferenceLine,
} from "recharts";

const AXIS = { fontSize: 12, fill: "#64748b" };
const LEGEND = { fontSize: 12, color: "#475569" };

// With a width the chart has a fixed size (used for the printed report).
// Without a width it follows its container.
function Frame({ width, height, children }) {
  if (width) return cloneElement(children, { width, height });
  return <ResponsiveContainer width="100%" height={height}>{children}</ResponsiveContainer>;
}

export function MarginChart({ data, series, locale = "en-US", width, height = 300, legend = true }) {
  const unit = locale === "de-DE" ? " %" : "%";
  const f = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return (
    <Frame width={width} height={height}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="year" tick={AXIS} tickLine={false} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}${unit}`} width={48} />
        <Tooltip formatter={(v) => `${f.format(Number(v))}${unit}`} />
        {legend && <Legend itemSorter={null} wrapperStyle={LEGEND} />}
        {series.map((s) => (
          <Line key={s.short} dataKey={s.short} stroke={s.color} strokeWidth={2.5} dot={{ r: 4 }} isAnimationActive={false} />
        ))}
      </LineChart>
    </Frame>
  );
}

export function GroupedBars({ data, series, unit = "", digits = 1, locale = "en-US", na = "n/a", width, height = 300 }) {
  const f = new Intl.NumberFormat(locale, { maximumFractionDigits: digits });
  return (
    <Frame width={width} height={height}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="year" tick={AXIS} tickLine={false} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} tickFormatter={(v) => f.format(v)} width={56} />
        <Tooltip formatter={(v) => (v == null ? na : `${f.format(Number(v))}${unit}`)} />
        <Legend itemSorter={null} wrapperStyle={LEGEND} />
        {series.map((s) => (
          <Bar key={s.short} dataKey={s.short} fill={s.color} radius={[3, 3, 0, 0]} isAnimationActive={false} />
        ))}
      </BarChart>
    </Frame>
  );
}

// Horizontal bars for a change that can be positive or negative
export function ChangeBars({ data, locale = "en-US", unit = "", width, height = 220 }) {
  const f = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return (
    <Frame width={width} height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
        <CartesianGrid stroke="#e2e8f0" horizontal={false} />
        <XAxis type="number" tick={AXIS} tickLine={false} axisLine={false} tickFormatter={(v) => f.format(v)} />
        <YAxis type="category" dataKey="name" tick={AXIS} tickLine={false} axisLine={false} width={96} />
        <ReferenceLine x={0} stroke="#94a3b8" />
        <Tooltip formatter={(v) => `${f.format(Number(v))} ${unit}`} />
        <Bar dataKey="value" isAnimationActive={false} radius={3}>
          {data.map((d) => <Cell key={d.name} fill={d.color} />)}
        </Bar>
      </BarChart>
    </Frame>
  );
}

// Revenue as bars (left axis) and margin as a line (right axis) for one company
export function ComboChart({ data, color, locale = "en-US", revLabel, marginLabel, width, height = 240 }) {
  const f1 = new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return (
    <Frame width={width} height={height}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="year" tick={AXIS} tickLine={false} />
        <YAxis yAxisId="l" tick={AXIS} tickLine={false} axisLine={false} width={44} />
        <YAxis yAxisId="r" orientation="right" tick={AXIS} tickLine={false} axisLine={false} width={40} />
        <Tooltip formatter={(v) => f1.format(Number(v))} />
        <Legend wrapperStyle={LEGEND} />
        <Bar yAxisId="l" dataKey="revenue" name={revLabel} fill={color} fillOpacity={0.85} radius={[3, 3, 0, 0]} isAnimationActive={false} />
        <Line yAxisId="r" dataKey="margin" name={marginLabel} stroke="#0f172a" strokeWidth={2.5} dot={{ r: 4 }} isAnimationActive={false} />
      </ComposedChart>
    </Frame>
  );
}

// Shows the chart on screen (responsive) and a fixed-size copy when printing
export function PrintSafe({ children, width }) {
  return (
    <>
      <div className="print:hidden">{children()}</div>
      <div className="hidden print:block">{children(width)}</div>
    </>
  );
}
