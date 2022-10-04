import {
  useWindowDimensions,
  TextInput,
  View,
  Text,
  Button,
  StyleSheet,
  Dimensions,
} from "react-native";

export function googleAuthScreen() {
  const { height, scale, width } = useWindowDimensions();
  return (
    <View style={{ flex: 1, height: height, width: width }}>
      <WebView source={{ uri: "http://localhost:4000/auth/google" }} />
    </View>
  );
}
