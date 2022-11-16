import React from "react";
import {Platform , ScrollView, FlatList, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useLinkTo } from "@react-navigation/native";
import { Text, TextInput, Button, Card, Divider } from "react-native-paper";
import { useQuery, useMutation } from "@apollo/client";
import Constants from 'expo-constants';
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import * as FileSystem from 'expo-file-system';


import {
  GET_FILES_UPLOADED_BY_USERID,
  ATTACH_FILEUPLOAD_TO_USERID,
} from "./requests";

import { AuthContext } from "../../auth/AuthContext";

const SERVERHOSTNAME:string = Constants.expoConfig.extra.SERVERHOSTNAME

const UPLOAD_URL = `http://${SERVERHOSTNAME}:3000`;


const b64toBlob = (b64Data:string, contentType='', sliceSize=512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}


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
    <ScrollView>
      <ListFiles filePaths={filePaths} />
      <AddFile refetch={refetch} userID={userID} />
    </ScrollView>
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
    console.log(documentUpload)
    let csvData 
    if (Platform.OS === 'web'){
      //convert to blob
      console.log('web')
      csvData = documentUpload.uri.split(",")[1];
    }else{
    //read file as blob
      console.log('android')
      csvData = await FileSystem.readAsStringAsync(documentUpload.uri,{ encoding: FileSystem.EncodingType.Base64})
      console.log(csvData)
    }

    const spongeblob = b64toBlob(csvData)
    console.log(spongeblob)

// dont use form data 
    const formData = new FormData();
    //formData.append("datauri", documentUpload.uri);
    //formData.append("uri", documentUpload.uri);
    formData.append("datauri", csvData);
    //formData.append("blob", spongeblob);
    formData.append("filename", documentUpload.name);
    //let fetchUrl = `${UPLOAD_URL}/api/upload`;
    console.log(formData)
    let fetchOptions = { method: "POST", 
    body: formData,
    headers: {
                'Content-Type': 'multipart/form-data; ',
		          },};
    console.log(fetchOptions)

/*
        const requestOptions = {
            method: 'POST',
            body: spongeblob,
        };
			
	console.log(requestOptions)
*/
    //let fetchUrl = `${UPLOAD_URL}/api/uploadchunk`;
    let fetchUrl = `${UPLOAD_URL}/api/upload`;
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
      <Button mode="contained" onPress={asHandleSelectFile}>Select File</Button>
      {documentUpload && (
        <>
          <Text>{documentUpload.name}</Text>
          <Button
            mode="outlined"
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
    alignItems: "center",
    justifyContent: "center",
  },
});

/*

    backgroundColor: '#fff',
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
