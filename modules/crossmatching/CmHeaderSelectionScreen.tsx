import React from "react";
import { StyleSheet, View, FlatList, ScrollView } from "react-native";

import {
  Text,
  Button,
  Divider,
  TextInput,
  Avatar,
  Checkbox,
  DataTable,
  HelperText,
  useTheme,
} from "react-native-paper";
import {
  useNavigation,
  NavigationContainer,
  Link,
  useLinkTo,
} from "@react-navigation/native";

const FASTAPI_URL = "http://192.168.43.9:8000"; // this should be  env variable

export function CmHeaderSelectionScreen() {
  const [headerStats, setHeaderStats] = React.useState(null);
  const navigation = useNavigation();

  React.useEffect(() => {
    async function asRequestHeaders() {
      let csvHeadersUrl = `${UPLOAD_URL}/api/headers`; //convert to fastapi
      let response = await fetch(csvHeadersUrl);
      let result = await response.json();
      let headerSt = result.headersColumns
        .sort()
        .map(function (currentElem: any) {
          const hstat = {
            headerName: currentElem,
            isChecked: false,
          };
          return hstat;
        });

      setHeaderStats(headerSt);
    }
    asRequestHeaders();
  }, []);

  function renderHeaders({ item }) {
    //console.log(item)
    return (
      <>
        <Text>{item.headerName}</Text>
        <Checkbox
          status={item.isChecked ? "checked" : "unchecked"}
          onPress={() => {
            setHeaderStats((prevState: any) =>
              prevState.map(function (currentElem: any) {
                let hstat;

                if (currentElem.headerName === item.headerName) {
                  hstat = {
                    headerName: currentElem.headerName,
                    isChecked: !currentElem.isChecked,
                  };
                } else {
                  hstat = currentElem;
                }

                return hstat;
              })
            );
          }}
        />
      </>
    );
  }

  function footerButton(navigation) {
    async function handleSendSelectedHeaders(navigation) {
      //console.log(headerStats)
      let postUrl = `${FASTAPI_URL}/headersselected`;
      const destHeader: any = headerStats.map(function (curElem: any) {
        let hname = curElem.headerName;
        let elem: any = {};
        elem[hname] = curElem.isChecked;
        return elem;
      });
      //console.log(JSON.stringify( destHeader))
      const jsonBody = JSON.stringify(destHeader);
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
      console.log(result);
      if (result.status == "success") {
        console.log("yes");
        navigation.navigate("Kdistance");
      }
    }

    return (
      <Button onPress={() => handleSendSelectedHeaders(navigation)}>
        Select Headers
      </Button>
    );
  }

  return (
    <FlatList
      //      style={styles.productsList}
      //      contentContainerStyle={styles.productsListContainer}
      //      ItemSeparatorComponent = {Divider}
      // key is needed
      data={headerStats}
      renderItem={renderHeaders}
      ListFooterComponent={footerButton(navigation)}
    />
  );
}
