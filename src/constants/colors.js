const calmCare = {
  light: {
    primary: "#2A9D8F",
    background: "#F0FAF9",
    text: "#264653",
    border: "#A8DADC",
    white: "#FFFFFF",
    textLight: "#6C757D",
    error: "#E63946",
    success: "#2A9D8F",
    card: "#FFFFFF",
    shadow: "rgba(38, 70, 83, 0.1)",
  },
  dark: {
    primary: "#66C2BC",
    background: "#112D29",
    text: "#D6F5F1",
    border: "#1E4D47",
    white: "#184A45",
    textLight: "#70A9A1",
    error: "#EF476F",
    success: "#66C2BC",
    card: "#184A45",
    shadow: "rgba(0, 0, 0, 0.6)",
  },
};

const sunrise = {
  light: {
    primary: "#FF6B6B",
    background: "#FFF5F0",
    text: "#3E2723",
    border: "#FFCCBC",
    white: "#FFFFFF",
    textLight: "#8D6E63",
    error: "#D32F2F",
    success: "#43A047",
    card: "#FFFFFF",
    shadow: "rgba(255, 107, 107, 0.2)",
  },
  dark: {
    primary: "#FF8A80",
    background: "#2E1A1A",
    text: "#FFECEB",
    border: "#5D4037",
    white: "#3E2723",
    textLight: "#BCAAA4",
    error: "#FF5252",
    success: "#81C784",
    card: "#3E2723",
    shadow: "rgba(0, 0, 0, 0.7)",
  },
};

const ocean = {
  light: {
    primary: "#0077B6",
    background: "#E0F7FA",
    text: "#023047",
    border: "#90CAF9",
    white: "#FFFFFF",
    textLight: "#607D8B",
    error: "#D62828",
    success: "#2E7D32",
    card: "#FFFFFF",
    shadow: "rgba(2, 48, 71, 0.15)",
  },
  dark: {
    primary: "#00B4D8",
    background: "#011627",
    text: "#CAF0F8",
    border: "#1E3A5F",
    white: "#15202B",
    textLight: "#90A4AE",
    error: "#EF233C",
    success: "#4CAF50",
    card: "#15202B",
    shadow: "rgba(0, 0, 0, 0.6)",
  },
};

const lavender = {
  light: {
    primary: "#9B5DE5",
    background: "#F8F0FF",
    text: "#3D3B40",
    border: "#D0BFFF",
    white: "#FFFFFF",
    textLight: "#9E9E9E",
    error: "#F44336",
    success: "#7ED6DF",
    card: "#FFFFFF",
    shadow: "rgba(155, 93, 229, 0.1)",
  },
  dark: {
    primary: "#D6A2E8",
    background: "#1B1B2F",
    text: "#F0EFFF",
    border: "#3E3A5D",
    white: "#2C2C54",
    textLight: "#B0BEC5",
    error: "#FF6B81",
    success: "#55E6C1",
    card: "#2C2C54",
    shadow: "rgba(0, 0, 0, 0.5)",
  },
};

export const THEMES = {
  calmCare,
  sunrise,
  ocean,
  lavender,
};

// Default theme selector
export const getTheme = (scheme = "light", selected = "calmCare") => {
  return THEMES[selected][scheme];
};

// Optional: Export default theme
export const COLORS = getTheme(); // Default: calmCare light
