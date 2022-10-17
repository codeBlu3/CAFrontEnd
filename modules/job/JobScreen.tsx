import React from "react";
import {
  Pressable,
  ScrollView,
  FlatList,
  StyleSheet,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useLinkTo } from "@react-navigation/native";
import { Text, TextInput, Button, Card, Divider } from "react-native-paper";
import { useQuery, useMutation } from "@apollo/client";

import { GET_JOBS_BY_USERID } from "./requests";

import { AuthContext } from "../../auth/AuthContext";
// kailangan ang current user context dito
const UPLOAD_URL = "http://192.168.43.9:3000"; // this should be  env variable

export function JobScreen() {
  const { currentAuthenticatedUser }: any = React.useContext(AuthContext);

  const userID = currentAuthenticatedUser;
  const [jobData, setJobData] = React.useState(null);
  const { loading, error, data, refetch } = useQuery(GET_JOBS_BY_USERID, {
    variables: { userID },
  });

  React.useEffect(() => {
    if (data) {
      setJobData(data.getJobsByUserID);
    }
  }, [data]);

  console.log(jobData);
  return (
    <View>
      <ListJobs jobData={jobData} />
    </View>
  );
}

//<AddFile refetch={refetch} userID={userID} />
//<ListFiles filePaths={filePaths} />
//style = {{flexDirection: "row"}}
function ListJobs({ jobData }: any) {
  const linkTo = useLinkTo();
  function handleRouteToResults(jobID: string, jobType: string) {
    //console.log(jobID)
    if (jobType === "dedupe") {
      linkTo(`/main/jobs/dpkdistance/${jobID}`);
    } else if (jobType === "crossmatch") {
      linkTo(`/main/jobs/cmkdistance/${jobID}`);
    }
  }

  function renderJobs({ item }) {
    return (
      <Pressable onPress={() => handleRouteToResults(item.jobID, item.jobType)}>
        <Text>{item.jobID}</Text>
        <Text>{item.jobType}</Text>
      </Pressable>
    );
  }
  return (
    <ScrollView>
      <FlatList
        //      style={styles.productsList}
        //      contentContainerStyle={styles.productsListContainer}
        ItemSeparatorComponent={Divider}
        data={jobData}
        renderItem={renderJobs}
      />
    </ScrollView>
  );
}
