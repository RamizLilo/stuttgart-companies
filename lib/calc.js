// Shared small calculations
export const pctChange = (a, b) => (a == null || b == null || a === 0 ? null : ((b - a) / a) * 100);
// Profit in billion euros = revenue x operating margin (Bosch publishes only the margin)
export const profitBn = (r) => (r.revenue * r.margin) / 100;
// Profit per employee in thousand euros
export const profitPerEmployee = (r) => (r.employees ? (profitBn(r) * 1e9) / r.employees / 1e3 : null);
