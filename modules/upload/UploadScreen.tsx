import React from 'react'
import { StyleSheet,  View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {useNavigation, useLinkTo} from '@react-navigation/native'
import { Text, TextInput, Button, Card, Divider } from "react-native-paper";
import { useQuery, useMutation } from "@apollo/client";
import * as DocumentPicker from 'expo-document-picker';

const UPLOAD_URL = 'http://192.168.43.9:3000'; // this should be  env variable
// double render to 
//double component





export function  UploadScreen(){

  return(
    <View >
      <AddFile/>
    </View>


  )
}



function  AddFile(){
  const navigation =  useNavigation()  
  const [documentUpload, setDocumentUpload] = React.useState(null)
  console.log(documentUpload)
  //navigation.navigate('Header Selection')
  //add use effect to prefetch user uploads


async function asHandleSelectFile()  {
    let documentPickerResult: any = await DocumentPicker.getDocumentAsync({type:"text/csv", base64: true});
    console.log(documentPickerResult) //may bug pa dito

    if (documentPickerResult.type == 'success'  &&  documentPickerResult.mimeType == 'text/csv') {
      setDocumentUpload( documentPickerResult)
    }
  }

  async function asUploadDocument(documentUpload:any){
  //split coding 
    //console.log(documentUpload)
    let csvData = documentUpload.uri.split(',')[1]    

    const formData = new FormData();
    //formData.append("datauri", documentUpload.uri);
    formData.append("datauri", csvData);

    formData.append("filename", documentUpload.name);
    let fetchUrl=  `${UPLOAD_URL}/api/upload`
    let fetchOptions =  { method: 'POST', body: formData}
    let response = await fetch(fetchUrl, fetchOptions);
    let result = await response.json();
    console.log(result)
    return {'uploadstatus': result.uploadstatus}
    }

  async function asHandleUploadDocument(documentUpload:any, navigation:any) {
    let fname = await asUploadDocument( documentUpload)
   if (fname.uploadstatus == 'success') {
     navigation.navigate('/home/dedupe')

   }
  }

  return (
    <View >
      <StatusBar style="auto" />
      <Button onPress = {asHandleSelectFile}>
      Select File
      </Button>
      { (documentUpload )  &&
     <> 

      <Text>
      {documentUpload.name}
      </Text >
      <Button  mode="contained" onPress = {() => asHandleUploadDocument(documentUpload, navigation)}>
      Upload File
      </Button>
 
     </>
      }

    </View>
  );
}








/*
    <View style={styles.container}>
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});





*/
