// Shared roadmap/degree constants.

// Total credits for a standard CUNY bachelor's degree. Used by the builder's
// credit-total validation and the Journey progress charts.
export const DEGREE_TOTAL = 120;

// Credit thresholds that mark class-standing milestones (Sophomore/Junior/etc.).
export const CREDIT_TIERS = [30, 60, 90, DEGREE_TOTAL] as const;
