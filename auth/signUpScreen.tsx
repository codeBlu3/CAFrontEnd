import React from "react";
import { Platform, View } from "react-native";
import { Text, TextInput, Button, Card, Divider } from "react-native-paper";
import { useLinkTo } from "@react-navigation/native";
import Constants from "expo-constants";

import { AuthContext } from "./AuthContext";

const SERVERHOSTNAME: string = Constants.expoConfig.extra.SERVERHOSTNAME;
const AUTH_URL = `http://${SERVERHOSTNAME}:4000`;

export function SignUpScreen() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const linkTo = useLinkTo();

  async function handleSignUp(username: string, password: string) {
    let postUrl = `${AUTH_URL}/register`;
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
    let result = await response.json();
    if (result.status == "User Created") {
      alert("user was created, please login"); // should be a modal screen
      linkTo("/signin");
    } else {
      alert("user was not created, please create again");
    }
  }

  return (
    <Card>
      <Card.Content>
        <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
        <TextInput
          mode="outlined"
          label="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          mode="outlined"
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button
          mode="contained"
          onPress={() => handleSignUp(username, password)}
        >
          Sign Up
        </Button>
      </Card.Content>
    </Card>
  );
}
