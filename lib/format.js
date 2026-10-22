// Number formats follow the page language (for example 132.2 vs 132,2).
export function makeFmt(t) {
  const nf = (d) => new Intl.NumberFormat(t.locale, { minimumFractionDigits: d, maximumFractionDigits: d });
  const zero = nf(0), one = nf(1), two = nf(2);
  const de = t.locale === "de-DE";
  const sign = (n) => (n > 0 ? "+" : n < 0 ? "−" : "");
  return {
    n0: (n) => zero.format(n),
    n1: (n) => one.format(n),
    n2: (n) => two.format(n),
    bn: (n) => `${one.format(n)} ${t.units.bn}`,
    bn2: (n) => `${two.format(n)} ${t.units.bn}`,
    // German style puts a space before the percent sign
    pct: (n) => (de ? `${one.format(n)} %` : `${one.format(n)}%`),
    // signed change in percent, for example +3.1%
    chg: (n) => `${sign(n)}${one.format(Math.abs(n))}${de ? " %" : "%"}`,
    // signed change in percentage points
    pp: (n) => `${sign(n)}${one.format(Math.abs(n))} ${t.units.pp}`,
    num: (n) => (n == null ? t.na : zero.format(n)),
    k: (n) => (n == null ? t.na : zero.format(n)), // the unit is in the table title
  };
}
