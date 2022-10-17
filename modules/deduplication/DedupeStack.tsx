import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { DedupeResultsScreen } from "./DedupeResultsScreen";
import { KdistanceSelectionScreen } from "./KdistanceSelectionScreen";
import { HeaderSelectionScreen } from "./HeaderSelectionScreen";
import { DpFileSelectionScreen } from "./DpFileSelectionScreen";

export function DedupeStack() {
  const DpStack = createNativeStackNavigator();
  return (
    <DpStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="DpFileSelection"
    >
      <DpStack.Screen
        name="DpFileSelection"
        component={DpFileSelectionScreen}
      />
      <DpStack.Screen
        name="HeaderSelection"
        component={HeaderSelectionScreen}
      />
      <DpStack.Screen name="Kdistance" component={KdistanceSelectionScreen} />
      <DpStack.Screen name="DedupeResult" component={DedupeResultsScreen} />
    </DpStack.Navigator>
  );
}
