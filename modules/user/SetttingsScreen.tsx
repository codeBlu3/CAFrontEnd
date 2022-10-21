import * as React from "react";
import { Text } from "react-native-paper";

import { useBreakpoint } from "../../hooks/useBreakpoint";

export default function responsiveText(props) {
  const { width, breakpoint } = useBreakpoint();

  const variantMap = {
    xs: "headlineSmall",
    sm: "headlineSmall",
    md: "headlineMedium",
    lg: "headlineLarge",
    xl: "headlineLarge",
  };

  return <Text variant={variantMap[breakpoint]} {...props} />;
}
