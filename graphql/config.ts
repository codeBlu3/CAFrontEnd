import { ApolloClient, InMemoryCache } from "@apollo/client";
import { Platform } from "react-native";
import Constants from "expo-constants";
//const SERVERHOSTNAME:string = Constants.expoConfig.extra.SERVERHOSTNAME

//const SERVERHOSTNAME:string = Platform.OS ==='web' ?  process.env.APP_MANIFEST.extra.SERVERHOSTNAME : "localhost"
const SERVERHOSTNAME: string = Constants.expoConfig.extra.SERVERHOSTNAME;
export const client = new ApolloClient({
  uri: `http://${SERVERHOSTNAME}:7000/`,
  cache: new InMemoryCache(),
});

// uri: "http://localhost:7000/",
//export const BASE_URL = 'http://localhost:7000';
//export const GRAPHQL_URL = `${BASE_URL}/graphql`;
