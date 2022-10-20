import React from "react";
import { View } from "react-native";
import { Text, TextInput, Button, Card, Divider } from "react-native-paper";
import { useLinkTo } from "@react-navigation/native";

import { AuthContext } from "./AuthContext";
import {useBreakpoint} from "../hooks/useBreakpoint"



const AUTH_URL = "http://localhost:4000"; // this should be  env variable

export function SignInScreen() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { signIn, setCurrentAuthenticatedUser }: any =
    React.useContext(AuthContext);
  const linkTo = useLinkTo();
  const {width, breakpoint } = useBreakpoint();
// i can use bp as key and equv text variant as as variant value 
const headlineMap  = {xs: "headlineSmall",
sm: "headlineSmall",
md: "headlineMedium",
lg: "headlineLarge",
xl: "headlineLarge"
}

const displayMap  = {xs: "displaySmall",
sm: "displaySmall",
md: "displayMedium",
lg: "displayLarge",
xl: "displayLarge"
}



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

        <Text variant={displayMap[breakpoint]}>Test</Text>
        <Text variant={headlineMap[breakpoint]}>Test</Text>
        <Text>{width}</Text>
        <Text>{breakpoint}</Text>
    </View>
  );
}

// how to map switch case? 
//input bp, output, text
// if bp m return

// i can use bp as key and equv text variant as as variant value 
const variantMap  = {xs: "headlineSmall",
sm: "headlineSmall",
md: "headlineMedium",
lg: "headlineLarge",
xl: "headlineLarge"
}


