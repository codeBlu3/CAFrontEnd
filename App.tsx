import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";

// Theming
import { Provider as PaperProvider } from "react-native-paper";
import {
  CombinedDarkTheme,
  CombinedDefaultTheme,
  LightTheme,
} from "./themes/themingConfig";
import { PreferencesContext } from "./themes/PreferencesContext";

//Routing
import { NavigationContainer } from "@react-navigation/native";
import LinkingConfig from "./navigation/LinkingConfig";
import { MainDraw } from "./navigation/MainDraw";

//Auth
import { lTokenTransform, initialTokenState } from "./auth/auth";
import { AuthContext } from "./auth/AuthContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SignUpScreen } from "./auth/signUpScreen";
import { SignInScreen } from "./auth/signInScreen";


// data laayer
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import { client } from "./graphql/config";



const AuthStack = createNativeStackNavigator();

export default function App() {
  //put change theme on settigns screen
  const [isThemeDark, setIsThemeDark] = React.useState(false);
  let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

  const toggleTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark]
  );

  // Auth
  const [state, dispatch] = React.useReducer(
    lTokenTransform,
    initialTokenState
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async () => {
        dispatch({ type: "SIGN_IN" });
      },
      signOut: () => {
        dispatch({ type: "SIGN_OUT" });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <PreferencesContext.Provider value={preferences}>
        <PaperProvider theme={theme}>
          <NavigationContainer theme={theme} linking={LinkingConfig}>
            <AuthStack.Navigator>
              {state.isSignout == false ? (
                <AuthStack.Group>
                  <AuthStack.Screen
                    name="SignIn"
                    component={SignInScreen}
                    options={{
                      title: "Sign In",
                    }}
                  />

                  <AuthStack.Screen
                    name="SignUp"
                    component={SignUpScreen}
                    options={{
                      title: "Sign Up",
                    }}
                  />
                </AuthStack.Group>
              ) : (
                <AuthStack.Group screenOptions={{ headerShown: false }}>
                  <AuthStack.Screen name="Main" component={MainDraw} />
                </AuthStack.Group>
              )}
            </AuthStack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </PreferencesContext.Provider>
    </AuthContext.Provider>
  );
}
