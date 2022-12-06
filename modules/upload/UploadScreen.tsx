import React from "react";
import { Platform, ScrollView, FlatList, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useLinkTo } from "@react-navigation/native";
import { Text, TextInput, Button, Card, Divider } from "react-native-paper";
import { useQuery, useMutation } from "@apollo/client";
import Constants from "expo-constants";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import md5 from "blueimp-md5";

import {
  GET_FILES_UPLOADED_BY_USERID,
  ATTACH_FILEUPLOAD_TO_USERID,
} from "./requests";

import { AuthContext } from "../../auth/AuthContext";

const SERVERHOSTNAME: string = Constants.expoConfig.extra.SERVERHOSTNAME;
const UPLOAD_URL = `http://${SERVERHOSTNAME}:3000`;


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
  // kailangan to i refactor
  // add upload status slider 
  const [documentUpload, setDocumentUpload] = React.useState(null);
  const [attachFileUpload, { data, loading, error }] = useMutation(
    ATTACH_FILEUPLOAD_TO_USERID
  );

  async function asHandleSelectFile() {
    let documentPickerResult: any = await DocumentPicker.getDocumentAsync({
      type: "text/csv",
    });

    if (
      documentPickerResult.type == "success" &&
      documentPickerResult.mimeType == "text/csv"
    ) {
      setDocumentUpload(documentPickerResult);
    }
  }

  async function asChunkUpload(documentUpload: any) {
    let csvData;
    if (Platform.OS === "web") {
      csvData = documentUpload.uri.split(",")[1];
    } else {
      csvData = await FileSystem.readAsStringAsync(documentUpload.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }

    const hash = md5(csvData);
    const blob = b64toBlob(csvData, "text/csv");
    const chunks = chunkBlob(blob);
    // add reposting if failure

    const postTasks = await PostRunner(chunks, hash);
    const jsonres = await Promise.all(postTasks)
      .then((values) => {
	return values
      })

    let chunkStat:any  = {}
    if  (jsonres.every(item => item.uploadstatus === 'success')){
       chunkStat['status'] = 'successful'
       chunkStat['hash'] = hash
    }else {

       chunkStat['status'] = 'unsuccessful'
    }
    return chunkStat
  }

  async function asMergeFile(hash:string, filename:string) {
    console.log(hash)
    console.log(filename)
        const formData = new FormData();
        formData.append("filehash", hash);
        formData.append("filename", filename);
        let fetchOptions = { method: "POST", body: formData };
        let fetchUrl = `${UPLOAD_URL}/api/mergefile`;
        let response = await fetch(fetchUrl, fetchOptions);
        let result = await response.json();
	console.log(result)
        return result;

  }
  

  async function asHandleUploadDocument(
    documentUpload: any,
    attachFileUpload: any,
    userID: any,
    refetch: any,
    setDocumentUpload: any
  ) {
    let chunkStat = await asChunkUpload(documentUpload);
    if (chunkStat.status === "successful"){ //flawed logic
      let res = await asMergeFile(chunkStat.hash, documentUpload.name)
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





    // add merge request 
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Button mode="contained" onPress={asHandleSelectFile}>
        Select File
      </Button>
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

    function chunkBlob(blob: any) {
      // make size as params
      let size = 1048576 * 2;
      let fileChunks: any[] = [];
      let index = 0; //Section num
      for (let cur = 0; cur < blob.size; cur += size) {
        fileChunks.push({
          sequence: index++,
          chunk: blob.slice(cur, cur + size),
        });
      }

      return fileChunks;
    }

    async function PostRunner(fileChunks: any[], hash: string) {
      const postTasks: any[] = fileChunks.map(async function createPost(arr) {
        const formData = new FormData();
        formData.append("filehash", hash);
        formData.append("sequence", arr.sequence);
        formData.append("chunk", arr.chunk);
        let fetchOptions = { method: "POST", body: formData };
        let fetchUrl = `${UPLOAD_URL}/api/uploadchunk`;
        let response = await fetch(fetchUrl, fetchOptions);
        let result = await response.json();
        return result;
      });
      return postTasks;
    }

const b64toBlob = (b64Data: string, contentType = "", sliceSize = 512) => {
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

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

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
