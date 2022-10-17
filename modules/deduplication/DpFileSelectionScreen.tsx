import React from "react";
import { ScrollView, FlatList, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useLinkTo } from "@react-navigation/native";
import {
  Checkbox,
  Text,
  TextInput,
  Button,
  Card,
  Divider,
} from "react-native-paper";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import * as DocumentPicker from "expo-document-picker";

import {
  GET_FILES_UPLOADED_BY_USERID,
  GET_HEADERS_BY_FILENAME,
  START_DEDUPE_JOB,
} from "./requests";

import { AuthContext } from "../../auth/AuthContext";

const UPLOAD_URL = "http://192.168.43.9:3000"; // this should be  env variable
const FASTAPI_URL = "http://192.168.43.9:8000"; // this should be  env variable
// consider splitting this to two subcomponents

export function DpFileSelectionScreen() {
  const linkTo = useLinkTo();
  //flie listing
  const { currentAuthenticatedUser }: any = React.useContext(AuthContext);
  const userID = currentAuthenticatedUser;
  const [uploadID, setUploadID] = React.useState("");
  const [filePaths, setFilePaths] = React.useState([]);
  const { loading, error, data, refetch } = useQuery(
    GET_FILES_UPLOADED_BY_USERID,
    {
      variables: { userID },
    }
  );

  React.useEffect(() => {
    if (data) {
      setUploadID(data.getFilesUploadedByUserID.uploadID);
      setFilePaths(data.getFilesUploadedByUserID.filePaths);
    }
  }, [data]);

  // Header Selection
  const [headerStats, setHeaderStats] = React.useState(null);
  const navigation = useNavigation();
  const [filenameSel, setFilenameSel] = React.useState("");

  const [
    getHeadersByFileName,
    { loading: loadinghd, error: errorhd, data: datahd },
  ] = useLazyQuery(GET_HEADERS_BY_FILENAME);

  React.useEffect(() => {
    async function asRequestHeaders(ltHeaders: any) {
      let headerSt = ltHeaders.sort().map(function (currentElem: any) {
        const hstat = {
          headerName: currentElem,
          isChecked: false,
        };
        return hstat;
      });
      setHeaderStats(headerSt);
    }
    if (datahd) {
      asRequestHeaders([...datahd.getHeadersbyFileName]);
    }
  }, [datahd]);

  const [startDedupeJob, { data: datarj, loading: loadinrj, error: errorrj }] =
    useMutation(START_DEDUPE_JOB);

  function handleFileHeaderQuery(filename: string) {
    console.log("aw");
    getHeadersByFileName({ variables: { filename: filename } });
    setFilenameSel(filename);
  }

  function renderUploadedFiles({ item }: any) {
    return (
      <View>
        <Button onPress={() => handleFileHeaderQuery(item)}>{item}</Button>
      </View>
    );
  }

  function renderHeaders({ item }: any) {
    // should sample data be rendered here?
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

  function footerButton(navigation: any, headerStats: any) {
    async function handleSendSelectedHeaders(navigation: any) {
      let headerselected: string[] = [];
      headerStats.forEach(function (item: any) {
        if (item.isChecked) {
          headerselected.push(item.headerName);
        }
      });

      const job: any = await startDedupeJob({
        variables: { userID, filename: filenameSel, headerselected },
      });
      const jobID = job.data.startDedupeJob.jobID;
      if (jobID) {
        alert(`job with ${jobID}`);
        //navigation.navigate('/main/uploads')
        linkTo("/main/jobs/joblist");
      }
    }

    return (
      <Button
        mode="contained"
        onPress={() => handleSendSelectedHeaders(navigation)}
      >
        Select Headers
      </Button>
    );
  }

  return (
    <>
      <ScrollView>
        <FlatList
          //      style={styles.productsList}
          //      contentContainerStyle={styles.productsListContainer}
          ItemSeparatorComponent={Divider}
          data={filePaths}
          renderItem={renderUploadedFiles}
        />

        {headerStats && (
          <FlatList
            //      style={styles.productsList}
            //      contentContainerStyle={styles.productsListContainer}
            ItemSeparatorComponent={Divider}
            // key is needed
            data={headerStats}
            renderItem={renderHeaders}
            ListFooterComponent={footerButton(navigation, headerStats)}
          />
        )}
      </ScrollView>
    </>
  );
}

/*
  React.useEffect( () => {
  async function asRequestHeaders()  {
    let csvHeadersUrl=  `${FASTAPI_URL}/dfCsvHeaders` //convert to fastapi
    let response = await fetch(csvHeadersUrl);
    let result = await response.json();
    let headerCol= await result.headerColumns
    let headerSt = headerCol.sort().map( 
      function (currentElem: any)  {
      const hstat = {
        headerName: currentElem,
	isChecked: false
      } 
      return hstat
      } 
    )

    setHeaderStats(headerSt)
  }
  asRequestHeaders()
  }
  ,[])

      let postUrl = `${FASTAPI_URL}/headersselected`;
      const destHeader: any = headerStats.map(function (curElem: any) {
        let hname = curElem.headerName;
        let elem: any = {};
        elem[hname] = curElem.isChecked;
        return elem;
      });
      //add map filteer
      console.log( destHeader)
      console.log(JSON.stringify( destHeader))
      const jsonBody = JSON.stringify(destHeader);
      const fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
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

*/
