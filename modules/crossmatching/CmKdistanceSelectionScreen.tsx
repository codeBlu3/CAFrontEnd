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

export function CmKdistanceSelectionScreen(props) {
  console.log(props);

  const navigation = useNavigation();
  const numberOfItemsPerPageList = [5, 10, 15, 20, 50];
  const [dfMatchesData, setDfMatchesData] = React.useState(null);
  const [filteredData, setFilteredData] = React.useState(null);
  const [kdistance, setKdistance] = React.useState(0.25);
  const [sortAscending, setSortAscending] = React.useState(true);
  const [upperHalf, setUpperHalf] = React.useState(true);

  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const [from, setFrom] = React.useState(0);
  const [to, setTo] = React.useState(0);

  console.log(kdistance);
  function filterSortData() {}

  React.useEffect(() => {
    async function asRequestdfmatchesdata() {
      let dfmatchesurl = `${FASTAPI_URL}/dfmatches`;
      let response = await fetch(dfmatchesurl, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      let result = await response.json();
      const matchesJson = JSON.parse(result);
      setDfMatchesData(matchesJson); //set orig data

      const ftData = matchesJson.filter(
        (match) => match.Kdistance <= kdistance
      ); //.sort((a, b) => {
      //    return a.Kdistance- b.Kdistance})
      //console.log(ft)
      //add set filtered data
      setFilteredData(ftData);

      setFrom(page * numberOfItemsPerPage);
      setTo(Math.min((page + 1) * numberOfItemsPerPage, ftData.length));
    }
    asRequestdfmatchesdata();
  }, []);

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  React.useEffect(() => {
    console.log(kdistance);
    // add filtered data
  }, [kdistance, sortAscending, upperHalf]);

  async function asHandleKdistance(navigation, kdistance) {
    let postUrl = `${FASTAPI_URL}/kdistanceselection`;
    const jsonBody = JSON.stringify({ kdistance: kdistance });
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
      navigation.navigate("CrossMatchingResults");
    }
  }
  //<Button onPress = {() => console.log('test')}>
  return (
    <View>
      <TextInput
        label="Kdistance"
        value={kdistance}
        onChangeText={(text) => {
          if (!isNaN(parseFloat(text))) {
            setKdistance(text);
          } else {
            console.log("non numeric");
          }
        }}
      />

      <Button onPress={() => asHandleKdistance(navigation, kdistance)}>
        Select Kdistance
      </Button>

      <Checkbox
        status={sortAscending ? "checked" : "unchecked"}
        onPress={() => {
          setSortAscending(!sortAscending);
        }}
      />

      <Checkbox
        status={upperHalf ? "checked" : "unchecked"}
        onPress={() => {
          setUpperHalf(!upperHalf);
        }}
      />

      <DataTable>
        <DataTable.Header>
          <DataTable.Title> Kdistance </DataTable.Title>
          <DataTable.Title> Database Data </DataTable.Title>
          <DataTable.Title>Query Data</DataTable.Title>
        </DataTable.Header>

        {filteredData &&
          filteredData
            .slice(
              page * numberOfItemsPerPage,
              page * numberOfItemsPerPage + numberOfItemsPerPage
            )
            .map((item) => (
              <DataTable.Row>
                <DataTable.Cell>{item.Kdistance}</DataTable.Cell>
                <DataTable.Cell>{item.DatabaseData}</DataTable.Cell>
                <DataTable.Cell>{item.QueryData}</DataTable.Cell>
              </DataTable.Row>
            ))}

        {filteredData && (
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(
              filteredData.length / numberOfItemsPerPage
            )}
            onPageChange={(page) => setPage(page)}
            label={`${from + 1}-${to} of ${filteredData.length}`}
            showFastPaginationControls
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={numberOfItemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            selectPageDropdownLabel={"Rows per page"}
          />
        )}
      </DataTable>
    </View>
  );
}
