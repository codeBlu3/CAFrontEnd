import React from "react";
import {Platform, View } from "react-native";
import { Text, TextInput, Button, Card, Divider } from "react-native-paper";
import { useLinkTo } from "@react-navigation/native";
import Constants from 'expo-constants';

import { AuthContext } from "./AuthContext";
import { useBreakpoint } from "../hooks/useBreakpoint";

const SERVERHOSTNAME:string = Constants.expoConfig.extra.SERVERHOSTNAME
const AUTH_URL = `http://${SERVERHOSTNAME}:4000`;

export function SignInScreen() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { signIn, setCurrentAuthenticatedUser }: any =
    React.useContext(AuthContext);
  const linkTo = useLinkTo();
  const { width, breakpoint } = useBreakpoint();

  async function handleSignIn(username: string, password: string) {
    let postUrl = `${AUTH_URL}/login`;
    const jsonBody = JSON.stringify({ username: username, password: password });
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: jsonBody,
    };

    const response = await fetch(postUrl, fetchOptions);
    //console.log(response);
    let result = await response.json();

    if (result.loginStatus == "success") {
      setCurrentAuthenticatedUser(result.userID);
      signIn();
    } else {
      alert("Invalid login , please try again");
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Card style={{ width: 400 }}>
        <Card.Content>
          <TextInput
            mode="outlined"
            label="Username"
            value={username}
            onChangeText={setUsername}
          />
          <Divider style={{ margin: 5 }} />
          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Divider style={{ margin: 5 }} />
          <Button
            mode="contained"
            compact={false}
            onPress={() => handleSignIn(username, password)}
          >
            <Text variant="headlineMedium">LOG-IN</Text>
          </Button>

          <Divider style={{ margin: 5 }} />

          <Button mode="contained" onPress={() => linkTo("/signup")}>
            <Text variant="headlineMedium">Register</Text>
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}
