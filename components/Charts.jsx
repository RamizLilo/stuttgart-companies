"use client";
import { cloneElement } from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, ComposedChart, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Cell, ReferenceLine, ScatterChart, Scatter, LabelList,
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

// One chart for any metric: bars or lines, with a number formatter for the axis and the tooltip.
// data rows look like { year: 2024, Porsche: 12.3, Bosch: null }
export function MetricChart({ data, series, kind = "bar", fmt, na = "n/a", width, height = 300, legend = true }) {
  const Chart = kind === "line" ? LineChart : BarChart;
  return (
    <Frame width={width} height={height}>
      <Chart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="year" tick={AXIS} tickLine={false} />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} tickFormatter={(v) => fmt(v)} width={60} />
        <Tooltip formatter={(v) => (v == null ? na : fmt(Number(v)))} />
        {legend && <Legend itemSorter={null} wrapperStyle={LEGEND} />}
        {series.map((s) => kind === "line"
          ? <Line key={s.short} dataKey={s.short} stroke={s.color} strokeWidth={2.5} dot={{ r: 4 }} isAnimationActive={false} />
          : <Bar key={s.short} dataKey={s.short} fill={s.color} radius={[3, 3, 0, 0]} isAnimationActive={false} />)}
      </Chart>
    </Frame>
  );
}

// Each point is one company in one year. Points of a company are joined in time order.
// series: [{ short, color, points: [{ x, y, year }] }]
export function ScatterView({ series, xLabel, yLabel, xFmt, yFmt, width, height = 320 }) {
  return (
    <Frame width={width} height={height}>
      <ScatterChart margin={{ top: 16, right: 24, left: 0, bottom: 20 }}>
        <CartesianGrid stroke="#e2e8f0" />
        <XAxis type="number" dataKey="x" name={xLabel} tick={AXIS} tickLine={false} tickFormatter={xFmt} domain={["auto", "auto"]}
          label={{ value: xLabel, position: "insideBottom", offset: -12, fontSize: 12, fill: "#64748b" }} />
        <YAxis type="number" dataKey="y" name={yLabel} tick={AXIS} tickLine={false} axisLine={false} tickFormatter={yFmt} width={52} domain={["auto", "auto"]} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }}
          formatter={(v, name) => (name === xLabel ? xFmt(v) : yFmt(v))}
          labelFormatter={() => ""} />
        <Legend itemSorter={null} wrapperStyle={LEGEND} />
        {series.map((s) => (
          <Scatter key={s.short} name={s.short} data={s.points} fill={s.color} line={{ stroke: s.color, strokeWidth: 1.5 }} lineType="joint" isAnimationActive={false}>
            <LabelList dataKey="year" position="top" style={{ fontSize: 11, fill: "#475569" }} />
          </Scatter>
        ))}
      </ScatterChart>
    </Frame>
  );
}
