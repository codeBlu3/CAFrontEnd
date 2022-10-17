import React from "react";
import { View } from "react-native";
import { Text, TextInput, Button, Card, Divider } from "react-native-paper";
import { useLinkTo } from "@react-navigation/native";

import { AuthContext } from "./AuthContext";

const AUTH_URL = "http://localhost:4000"; // this should be  env variable

export function SignInScreen() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { signIn, setCurrentAuthenticatedUser }: any =
    React.useContext(AuthContext);
  const linkTo = useLinkTo();

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
    console.log(response);
    let result = await response.json();

    if (result.loginStatus == "success") {
      setCurrentAuthenticatedUser(result.userID);
      signIn();
    } else {
      alert("Invalid login , please try again");
    }
  }

  return (
    <View>
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
        </Card.Content>
      </Card>

      <Divider />
      <Button
        mode="contained"
        compact={false}
        onPress={() => handleSignIn(username, password)}
      >
        <Text variant="headlineMedium">Sign In</Text>
      </Button>

      <Divider />

      <Button mode="contained" onPress={() => linkTo("/signup")}>
        <Text variant="headlineMedium">Register</Text>
      </Button>
    </View>
  );
}
