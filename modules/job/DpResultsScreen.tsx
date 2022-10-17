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

const FASTAPI_URL = "http://localhost:8000"; // this should be  env variable

export function DpResultsScreen({ route }: any) {
  const { jobID } = route.params;
  const navigation = useNavigation();

  const [dedupeHeaders, setDedupeHeaders] = React.useState(null);
  const [dedupeData, setDedupeData] = React.useState(null);

  const numberOfItemsPerPageList = [5, 10, 15, 20, 50];
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const [from, setFrom] = React.useState(0);
  const [to, setTo] = React.useState(0);

  React.useEffect(() => {
    async function asRequestResultsHeaders() {
      let dfResultsHeaderUrl = `${FASTAPI_URL}/dfResultsHeaders`;
      const jsonBody = JSON.stringify({ jobID});
      let response = await fetch(dfResultsHeaderUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: jsonBody,
      });
      let result = await response.json();
      const ltcolumns = result.headerColumns;
      // ltcolumns.map(item => (console.log(item)))
      setDedupeHeaders(ltcolumns);
    }

    async function asRequestDfWithGroupID() {
      let dfdpOrigWithDupIdUrl = `${FASTAPI_URL}/dfdpOrigWithDupId`;
      const jsonBody = JSON.stringify({ jobID});
      let response = await fetch(dfdpOrigWithDupIdUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: jsonBody,
      });
      let result = await response.json();
      const dedupeJson = JSON.parse(result);
      //    dedupeJson.map(data=> Object.values(data).forEach(val => console.log(val)))

      setDedupeData(dedupeJson);

      setFrom(page * numberOfItemsPerPage);
      setTo(Math.min((page + 1) * numberOfItemsPerPage, dedupeJson.length));
    }
    asRequestResultsHeaders();
    asRequestDfWithGroupID();
  }, []);

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  return (
    <View>
      <DataTable>
        {dedupeHeaders && (
          <DataTable.Header>
            {dedupeHeaders.map((item) => (
              <DataTable.Title>{item}</DataTable.Title>
            ))}
          </DataTable.Header>
        )}

        {dedupeData &&
          dedupeData
            .slice(
              page * numberOfItemsPerPage,
              page * numberOfItemsPerPage + numberOfItemsPerPage
            )
            .map((data) => (
              <DataTable.Row>
                {Object.values(data).map((val) => (
                  <DataTable.Cell>{val}</DataTable.Cell>
                ))}
              </DataTable.Row>
            ))}

        {dedupeData && (
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(dedupeData.length / numberOfItemsPerPage)}
            onPageChange={(page) => setPage(page)}
            label={`${from + 1}-${to} of ${dedupeData.length}`}
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

//  <ScrollView horizontal>
//  </ScrollView>
