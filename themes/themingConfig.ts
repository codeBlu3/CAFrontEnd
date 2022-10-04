import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

import {
  MD3DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  configureFonts,
} from "react-native-paper";

import merge from "deepmerge";

import { fontConfig } from "./fontConfig";

// there should also be forced light theme
export const CombinedDefaultTheme = merge(
  PaperDefaultTheme,
  NavigationDefaultTheme
);
export const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);
export const LightTheme = {
  ...CombinedDefaultTheme,
  sizes: {
    small: 8,
    medium: 16,
    large: 24,
    extraLarge: 40,
  },
  fonts: configureFonts(fontConfig),
};

// only use one color pallette, for branding purposes  -- no togggle button
// additional color creation
