import {rgb} from "d3-color";
import React from "react";
import LanguageColors from "./language_colors";

/* export const TESTING = navigator.userAgent.includes("jsdom"); */
export const TESTING = false;
export const GRAIN_ENABLED = true;
export const MAIN_FONT = "Yeager";
export const PINNED_REPOS = new Set([
  "fancy_switcher",
  "volskaya.dev",
  "firestore_model",
  "presence",
  "firebase_image",
]);
export const ENABLE_CONTACT = false;

export const NAME = "Roland";
export const USERNAME = "volskaya";
export const EMAIL = "roland@volskaya.dev";
export const GITHUB_API = "https://api.github.com";
export const GITHUB = "https://github.com";
export const GITHUB_RAW = "https://raw.githubusercontent.com";

export const STRING_CONTACT_SUCCESS = "Email sent successfully!";
export const STRING_CONTACT_ERROR = "Unknown error, email failed!";

export const BACKGROUND_COLOR = "#121212";
export const BACKGROUND_HIGHLIGHT = "#2112121";
export const BACKGROUND_DARK = "#212121";
export const FOREGROUND_COLOR = "#ffffff";
export const LANGUAGE_COLORS = LanguageColors;
export const LANGUAGE_PLACEHOLDER = "#444444";
export const README_FILENAME = "README.md";
export const REPO_NAME_LENGTH_LIMIT = 32;
export const PURPLE = "#7941f2";
export const PURPLE_LIGHT = "#8f8bbc";
export const GREEN = "#83e17a";
export const RED = "#fd7482";

const purpleHighlight = rgb(PURPLE_LIGHT);
purpleHighlight.opacity = 0.3;
export const PURPLE_HIGHLIGHT = purpleHighlight.toString();

export const MATERIAL_GRAY_800 = "#424242";
export const MATERIAL_GRAY_700 = "#616161";
export const MATERIAL_GRAY_500 = "#9E9E9E";
export const MATERIAL_GRAY_400 = "#BDBDBD";

export const BP_SMALL = 576;
export const BP_MEDIUM = 768;
export const BP_LARGE = 992;
export const BP_EXTRA_LARGE = 1200;

export const MOBILE_DETECTION: Readonly<{
  phone: boolean;
  tablet: boolean;
  mobile: boolean;
}> = {
  phone: false,
  tablet: false,
  mobile: false,
};

// Font, Yeager.
enum Size {
  LIGHT = 300,
  REGULAR = 500,
  BOLD = 700,
}

export const Yeager = {
  family: `${MAIN_FONT}, sans-serif`,
  size: {
    12: {
      fontSize: 12,
      letterSpacing: 0.4,
      fontWeight: Size.LIGHT,
    },
    14: {
      fontSize: 14,
      letterSpacing: 0.25,
      fontWeight: Size.REGULAR,
    },
    16: {
      fontSize: 16,
      letterSpacing: 0.4,
      fontWeight: Size.LIGHT,
    },
    reg: {
      fontSize: 16,
      letterSpacing: 0.5,
      fontWeight: Size.REGULAR,
    },
    24: {
      fontSize: 24,
      letterSpacing: 0,
      fontWeight: Size.REGULAR,
    },
    50: {
      fontSize: 50,
      letterSpacing: 0,
      fontWeight: Size.LIGHT,
    },
    70: {
      fontSize: 70,
      letterSpacing: "1.8rem",
      fontWeight: Size.BOLD,
    },
    caption: {
      fontSize: 14,
      letterSpacing: 0.25,
      fontWeight: Size.LIGHT,
    },
    code: {
      fontWeight: Size.BOLD,
      fontSize: 20,
      letterSpacing: 0.5,
      lineHeight: 1.2,
    },
    mono: {
      fontFamily: '"Roboto Mono", monospace',
      fontSize: 14,
      fontWeight: Size.BOLD,
      lineHeight: 1.2,
    },
  },
};

// Triangle Overlay.
export enum OverlayTriangleType {
  SMALL = 1,
  REGULAR = 5,
  BIG = 4,
}

export const TRIANGLE_PADDING = 86;
export const TRIANGLE_COLOR = FOREGROUND_COLOR;
export const TRIANGLE_WIDTHS = {
  [OverlayTriangleType.SMALL]: 32,
  [OverlayTriangleType.REGULAR]: 64,
  [OverlayTriangleType.BIG]: 128 * 2,
};
export const TRIANGLE_COUNT = {
  [OverlayTriangleType.SMALL]: 5,
  [OverlayTriangleType.REGULAR]: 3,
  [OverlayTriangleType.BIG]: 3,
};
export const TRIANGLE_OPACITY = {
  [OverlayTriangleType.SMALL]: 0.16,
  [OverlayTriangleType.REGULAR]: 0.04,
  [OverlayTriangleType.BIG]: 0.02,
};
export const TRIANGLE_ZINDEX = {
  [OverlayTriangleType.SMALL]: -2,
  [OverlayTriangleType.REGULAR]: -2,
  [OverlayTriangleType.BIG]: 3,
};

// Helper functions.
export function randomBetween(x: number, y: number): number {
  return Math.round(x + (y - x) * Math.random());
}

export function getStorageBool(key: string): boolean | undefined {
  switch (typeof localStorage !== "undefined" ? localStorage.getItem(key) : "false") {
    case "true":
      return true;
    case "false":
      return false;
    default:
      return undefined;
  }
}

export function hasWindow() {
  return typeof window !== "undefined";
}

export function PurpleWrap({
  children,
  onClick,
  light = false,
}: Readonly<{
  children: string;
  onClick?: () => void;
  light?: boolean;
}>): JSX.Element {
  return (
    <span style={{color: light ? PURPLE_LIGHT : PURPLE}} onClick={onClick}>
      {children}
    </span>
  );
}
