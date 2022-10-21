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

declare global {
  namespace ReactNativePaper {
    type Breakpoint =  'sm' | 'md' | 'lg' ;

    interface ThemeBreakpoints {
      values: { [k in Breakpoint]: number };
    }

    interface Theme {
      breakpoints: ThemeBreakpoints;
    }
  }
}



//const { lightScheme } = createDynamicThemeColors({ sourceColor: '#FFFF00' });
console.log(NavigationDefaultTheme)
console.log(PaperDefaultTheme)

const CombinedDefaultTheme = merge(
  PaperDefaultTheme,
  NavigationDefaultTheme
);

export const CombinedDefaultThemeBp = {
  ...CombinedDefaultTheme,
  breakpoints: {
    values: {
      sm: 0,
      md: 900,
      lg: 1200,
    },
  },
};


const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);
export const CombinedDarkThemeBp = {
  ...CombinedDarkTheme,
  breakpoints: {
    values: {
      sm: 0,
      md: 900,
      lg: 1200,
    },
  },
};


  //fonts: configureFonts(fontConfig),
// only use one color pallette, for branding purposes  -- no togggle button
// additional color creation
