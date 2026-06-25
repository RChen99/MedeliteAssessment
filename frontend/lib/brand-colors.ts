export const BRAND_COLORS = {
  pink: "#E91E8C",
  purple: "#7B2CBF",
  blueLight: "#5DA9DD",
  blue: "#1E78B4",
  grey: "#8B8B8B",
  text: "#312E81",
  muted: "#6B7280",
  light: "#F8FAFC",
  white: "#FFFFFF",
} as const;

export const BRAND_GRADIENT = `linear-gradient(90deg, ${BRAND_COLORS.pink} 0%, ${BRAND_COLORS.purple} 100%)`;
