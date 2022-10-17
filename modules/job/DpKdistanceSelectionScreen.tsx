import React from "react";
import { StyleSheet, View, FlatList, ScrollView } from "react-native";
import {
  useNavigation,
  NavigationContainer,
  Link,
  useLinkTo,
} from "@react-navigation/native";
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
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";

import { GET_MATCHESDATA_BY_JOBID, MERGE_KDISTANCE_TO_ORIG } from "./requests";

const FASTAPI_URL = "http://192.168.43.9:8000"; // this should be  env variable

export function DpKdistanceSelectionScreen({ route }: any) {
  const { jobID } = route.params;

  const navigation = useNavigation();
  const linkTo = useLinkTo();

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

  function filterSortData() {}
  const { loading, error, data } = useQuery(GET_MATCHESDATA_BY_JOBID, {
    variables: { jobID },
  });



  const [mergeKdistanceToOrig, { data: datakd, loading: loadingkd, error: errorkd }] =
    useMutation(MERGE_KDISTANCE_TO_ORIG);



  React.useEffect(() => {
    async function asRequestdfmatchesdata() {
      if (data) {
        console.log(data);

        setDfMatchesData(data.getMatchesDataByJobID); //set orig data

        const ftData = data.getMatchesDataByJobID.filter(
          (match) => match.Kdistance <= kdistance
        ); //.sort((a, b) => {
        //    return a.Kdistance- b.Kdistance})
        //console.log(ft)
        //add set filtered datkj
        setFilteredData(ftData);

        setFrom(page * numberOfItemsPerPage);
        setTo(Math.min((page + 1) * numberOfItemsPerPage, ftData.length));
      }
    }

    asRequestdfmatchesdata();
  }, [data]);

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  React.useEffect(() => {
    console.log(kdistance);
    // add filtered data
  }, [kdistance, sortAscending, upperHalf]);

  async function asHandleKdistance(navigation, kdistance) {
    /*
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
      navigation.navigate("DedupeResult");
    }
      const job: any = await startDedupeJob({
        variables: { userID, filename: filenameSel, headerselected },
      });
      const jobID = job.data.startDedupeJob.jobID;
      if (jobID) {
        alert(`job with ${jobID}`);
        //navigation.navigate('/main/uploads')
        linkTo("/main/jobs/joblist");
      }

  */
  console.log(jobID)
  console.log(kdistance)

    //transfer to different result screen
    const kdstat =  await mergeKdistanceToOrig({
    variables : {jobID, kdistance}
    })
    console.log(kdstat)
    if (kdstat.data.mergeKdistanceToOrig ==='success'){
      linkTo(`/main/jobs/dpresult/${jobID}`);
    }

  }
// add loading
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
