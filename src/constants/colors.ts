// colors.ts

interface ColorScheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  border: string;
  white: string;
  textLight: string;
  error: string;
  success: string;
  card: string;
  shadow: string;
}

interface Theme {
  light: ColorScheme | null;
  dark: ColorScheme | null;
}

interface ThemeCollection {
  [key: string]: Theme;
}

const calmCare: Theme = {
  light: {
    primary: "#2A9D8F",
    secondary: "#E9C46A",
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
    secondary: "#F4A261",
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

const sunrise: Theme = {
  light: {
    primary: "#FF6B6B",
    secondary: "#FFD166",
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
    secondary: "#F6AE2D",
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

const ocean: Theme = {
  light: {
    primary: "#0077B6",
    secondary: "#90E0EF",
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
    secondary: "#48CAE4",
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

const lavender: Theme = {
  light: {
    primary: "#9B5DE5",
    secondary: "#F15BB5",
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
    secondary: "#F484C6",
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

const mint: Theme = {
  light: {
    primary: "#00C9A7",
    secondary: "#B2F7EF",
    background: "#E6FFFA",
    text: "#0F3D3E",
    border: "#A7FFF6",
    white: "#FFFFFF",
    textLight: "#5EAAA8",
    error: "#F44336",
    success: "#00C896",
    card: "#FFFFFF",
    shadow: "rgba(0, 201, 167, 0.1)",
  },
  dark: null,
};

const midnight: Theme = {
  light: null,
  dark: {
    primary: "#1E1E2F",
    secondary: "#5C5470",
    background: "#121212",
    text: "#E0E0E0",
    border: "#2C2C3E",
    white: "#1E1E2F",
    textLight: "#AAAAAA",
    error: "#FF5370",
    success: "#C3E88D",
    card: "#1E1E2F",
    shadow: "rgba(0, 0, 0, 0.6)",
  },
  
};

const telemedicine: Theme = {
  light: {
    primary: '#0555ABFF',
    secondary: '#A0AEC0FF',
    background: '#F7F9FCFF',
    text: '#222222FF',
    border: '#033E73FF',
    white: '#FFFFFF',
    textLight: '#555555FF',
    error: '#E53E3EFF',
    success: '#38A169FF',
    card: '#FFFFFF',
    shadow: 'rgba(5, 85, 171, 0.2)',
  },
  dark: null,
};

export const THEMES: ThemeCollection = {
  calmCare,
  sunrise,
  ocean,
  lavender,
  mint,
  midnight,
  telemedicine
};

type ColorSchemeType = "light" | "dark";
type ThemeName = keyof typeof THEMES;

/**
 * Get theme colors by scheme and selected theme
 * @param scheme - "light" or "dark"
 * @param selected - theme name from THEMES keys
 * @returns theme color object
 */
export const getTheme = (scheme: ColorSchemeType = "light", selected: ThemeName = "telemedicine"): ColorScheme => {
  const theme = THEMES[selected];
  if (!theme) return THEMES["ocean"][scheme]!;
  
  const colorScheme = theme[scheme];
  if (!colorScheme) return THEMES["ocean"][scheme]!; // fallback to ocean if null
  
  return colorScheme;
};

// Default export of the default theme (calmCare light)
const COLORS: ColorScheme = getTheme();

export default COLORS; 