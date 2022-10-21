import React from "react";
import { ScrollView, FlatList, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useLinkTo } from "@react-navigation/native";
import { Text, TextInput, Button, Card, Divider } from "react-native-paper";
import { useQuery, useMutation } from "@apollo/client";
import * as DocumentPicker from "expo-document-picker";

import {
  GET_FILES_UPLOADED_BY_USERID,
  ATTACH_FILEUPLOAD_TO_USERID,
} from "./requests";

import { AuthContext } from "../../auth/AuthContext";
// kailangan ang current user context dito
const UPLOAD_URL = "http://192.168.43.9:3000"; // this should be  env variable

export function UploadScreen() {
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

  return (
    <View>
      <ListFiles filePaths={filePaths} />
      <AddFile refetch={refetch} userID={userID} />
    </View>
  );
}

function ListFiles({ filePaths }: any) {
  function renderUploadedFiles({ item }) {
    return (
      <View>
        <Text>{item}</Text>
      </View>
    );
  }
  return (
    <ScrollView>
      <FlatList
        //      style={styles.productsList}
        //      contentContainerStyle={styles.productsListContainer}
        ItemSeparatorComponent={Divider}
        data={filePaths}
        renderItem={renderUploadedFiles}
      />
    </ScrollView>
  );
}

function AddFile({ refetch, userID }: any) {
  const [documentUpload, setDocumentUpload] = React.useState(null);
  const [attachFileUpload, { data, loading, error }] = useMutation(
    ATTACH_FILEUPLOAD_TO_USERID
  );

  async function asHandleSelectFile() {
    let documentPickerResult: any = await DocumentPicker.getDocumentAsync({
      type: "text/csv",
      base64: true,
    });
    console.log(documentPickerResult); //may bug pa dito

    if (
      documentPickerResult.type == "success" &&
      documentPickerResult.mimeType == "text/csv"
    ) {
      setDocumentUpload(documentPickerResult);
    }
  }

  async function asUploadDocument(documentUpload: any) {
    //split coding
    //console.log(documentUpload)
    let csvData = documentUpload.uri.split(",")[1];

    const formData = new FormData();
    //formData.append("datauri", documentUpload.uri);
    formData.append("datauri", csvData);

    formData.append("filename", documentUpload.name);
    let fetchUrl = `${UPLOAD_URL}/api/upload`;
    let fetchOptions = { method: "POST", body: formData };
    let response = await fetch(fetchUrl, fetchOptions);
    let result = await response.json();
    //console.log(result);
    return result;
  }

  async function asHandleUploadDocument(
    documentUpload: any,
    attachFileUpload: any,
    userID: any,
    refetch: any,
    setDocumentUpload: any
  ) {
    let res = await asUploadDocument(documentUpload);
    console.log(userID);
    if (res.uploadstatus == "success") {
      let uploadID = await attachFileUpload({
        variables: { userID, filepath: res.filename },
      });
      if (uploadID) {
        refetch({ variables: { userID } });
        setDocumentUpload(null);
      }

      // this should trigger refetch
      //navigation.navigate("/home/dedupe");
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Button onPress={asHandleSelectFile}>Select File</Button>
      {documentUpload && (
        <>
          <Text >{documentUpload.name}</Text>
          <Button
            mode="contained"
            onPress={() =>
              asHandleUploadDocument(
                documentUpload,
                attachFileUpload,
                userID,
                refetch,
                setDocumentUpload
              )
            }
          >
            Upload File
          </Button>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});





/*
  const [uploadID, setUploadID] = React.useState("");
  const [filePaths, setFilePaths] = React.useState([]);


  React.useEffect(() => {
    if (data) {
      setUploadID(data.getFilesUploadedByUserID.uploadID);
      setFilePaths(data.getFilesUploadedByUserID.filePaths);
      
    }
  }, [data]);
 
  if (loading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }

  if (error) {
    console.log(error);
    return (
      <View>
        <Text>Error</Text>
      </View>
    );
  }


*/
