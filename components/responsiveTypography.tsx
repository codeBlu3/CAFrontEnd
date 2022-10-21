//<Text variant={variantMap[breakpoint]}>Test</Text>
const variantMap = {
  xs: "headlineSmall",
  sm: "headlineSmall",
  md: "headlineMedium",
  lg: "headlineLarge",
  xl: "headlineLarge",
};

// i can use bp as key and equv text variant as as variant value
const headlineMap = {
  sm: "headlineSmall",
  md: "headlineMedium",
  lg: "headlineLarge",
};

const displayMap = {
  sm: "displaySmall",
  md: "displayMedium",
  lg: "displayLarge",
};

// how to map switch case?
//input bp, output, text
// if bp m return
/*

        <Text variant={headlineMap[breakpoint]}>Test</Text>
        <Text>{width}</Text>
        <Text>{breakpoint}</Text>

*/

// i can use bp as key and equv text variant as as variant value
