import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CrossMatchingResultsScreen } from "./CrossMatchingResultsScreen";
import { CmKdistanceSelectionScreen } from "./CmKdistanceSelectionScreen";
import { CmHeaderSelectionScreen } from "./CmHeaderSelectionScreen";

export function CrossMatchingStack() {
  const CmStack = createNativeStackNavigator();
  return (
    <CmStack.Navigator initialRouteName="CmKdistance">
      <CmStack.Screen
        name="CmHeaderSelection"
        component={CmHeaderSelectionScreen}
      />
      <CmStack.Screen
        name="CmKdistance"
        component={CmKdistanceSelectionScreen}
      />
      <CmStack.Screen
        name="CrossMatchingResults"
        component={CrossMatchingResultsScreen}
      />
    </CmStack.Navigator>
  );
}
