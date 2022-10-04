import React from "react";

import { View } from "react-native";
import {
  useTheme,
  Appbar,
  TouchableRipple,
  Switch,
  Text,
} from "react-native-paper";
import { Drawer as Drawernp } from "react-native-paper";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

import { PreferencesContext } from "../themes/PreferencesContext";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthContext } from "../auth/AuthContext";

//screens
import {UploadScreen} from "../modules/upload/UploadScreen"




const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any) {
  //const { signOut } = React.useContext(AuthContext);
  //<DrawerItem label="Log Out" onPress={() => signOut()} />
  const theme = useTheme();
  const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);

  const { signOut }: any = React.useContext(AuthContext);
  //<DrawerItem label="Help" onPress={() => alert("Link to help")} />

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View>
        <Text variant="titleLarge">Change theme</Text>
        <Switch
          style={[{ backgroundColor: theme.colors.accent }]}
          color={"red"}
          value={isThemeDark}
          onValueChange={() => toggleTheme()}
        />
      </View>
      <DrawerItem label="Log Out" onPress={() => signOut()} />
    </DrawerContentScrollView>
  );
}

export function MainDraw() {
  return (
    <Drawer.Navigator
      initialRouteName="Uploads"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Uploads" component={UploadScreen} />
      <Drawer.Screen name="Details" component={DetailsScreen} />
    </Drawer.Navigator>
  );
}

      //<Drawer.Screen name="Home" component={HomeScreen} />
function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text variant="displayLarge">Home Screen</Text>
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Details Screen</Text>
    </View>
  );
}
