import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { JobScreen } from "./JobScreen";
import { DpKdistanceSelectionScreen } from "./DpKdistanceSelectionScreen";

import { DpResultsScreen } from "./DpResultsScreen";

export function JobStack() {
  const JbStack = createNativeStackNavigator();
  return (
    <JbStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="JobScreen"
    >
      <JbStack.Screen name="JobScreen" component={JobScreen} />
      <JbStack.Screen
        name="DpKdistanceSelectionScreen"
        component={DpKdistanceSelectionScreen}
      />

      <JbStack.Screen name="DpResultsScreen" component={DpResultsScreen} />
    </JbStack.Navigator>
  );
}
