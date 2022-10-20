import React from "react";

import { View, useWindowDimensions } from "react-native";
import {
  useTheme,
  Appbar,
  TouchableRipple,
  Switch,
  Badge,
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
import { UploadScreen } from "../modules/upload/UploadScreen";
import { JobStack } from "../modules/job/JobStack";
import { DedupeStack } from "../modules/deduplication/DedupeStack"; //screen lang dapat to  dalawa
import { CrossMatchingStack } from "../modules/crossmatching/CrossMatchingStack"; //screen lang dapat

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function rightSwitch() {
  const { isThemeDark } = React.useContext(PreferencesContext);
  return <Switch color={"red"} value={isThemeDark} />;
}

function CustomDrawerContent(props: any) {
  //pakilipat nga to
  const theme = useTheme();
  const { toggleTheme, isThemeDark } = React.useContext(PreferencesContext);

  const [active, setActive] = React.useState("");

  const { signOut }: any = React.useContext(AuthContext);

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <Drawernp.Section>
        <Drawernp.Item
          label="First Item"
          active={active === "first"}
          onPress={() => setActive("first")}
        />
        <Drawernp.Item
          label="Second Item"
          active={active === "second"}
          onPress={() => setActive("second")}
        />
        <Drawernp.Item
          label="Toggle Theme"
          onPress={() => toggleTheme()}
          right={rightSwitch}
        />
        <Drawernp.Item label="Log Out" onPress={() => signOut()} />
      </Drawernp.Section>
    </DrawerContentScrollView>
  );
}

function CustomNavigationBar({ navigation }) {
  //pakilipat nga to
  //console.log(props) try kaya to
  //console.log(navigation)
  //console.log(navigation.canGoBack())
  //const [isSearchBarVisible,  setIsSearchBarVisible ] = React.useState(false)

  //      <Searchbar   placeholder="Search"/> should show search bar upon hunt Icont
  //const openDrawerFromBar= () => navigation.openDrawer()
  //style={{height: '10%'}}
  //<Appbar.Action icon="menu" onPress={openDrawerFromBar()} />
  //<Appbar.BackAction onPress={navigation.goBack} />
  //  {navigation.canGoBack()? <Appbar.BackAction onPress={navigation.goBack} /> : null} //weird routing behavior
  // also hide menu from appbar if screen is big
  // expo push notifs. dapat may add to eh
  //convert  to toggle ba?

  return (
    <Appbar.Header>
      <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
      <Appbar.Content
        title="Audit Automation Tool"
        style={{ alignItems: "center" }}
      />
      <Appbar.Action icon="bell" onPress={() => navigation.closeDrawer()} />
    </Appbar.Header>
  );
}

export function MainDraw() {
  //change screen title of stack
  // convert to use bp 
    const dimensions = useWindowDimensions();
  return (
    <Drawer.Navigator
      initialRouteName="Jobs"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{drawerType: dimensions.width >= 768 ? 'permanent' : 'front' , header: (props) => <CustomNavigationBar {...props} /> }}
    >
      <Drawer.Screen name="Uploads" component={UploadScreen} />
      <Drawer.Screen name="Job" component={JobStack} />
      <Drawer.Screen name="Dedupe" component={DedupeStack} />
      <Drawer.Screen name="CrossMatching" component={CrossMatchingStack} />
    </Drawer.Navigator>
  );
}
