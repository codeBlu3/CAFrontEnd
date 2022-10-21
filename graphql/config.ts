import { ApolloClient, InMemoryCache } from "@apollo/client";

const SERVERHOSTNAME:any = process.env.APP_MANIFEST.extra.SERVERHOSTNAME

export const client = new ApolloClient({
  uri: `http://${SERVERHOSTNAME}:7000/`,
  cache: new InMemoryCache(),
});

 // uri: "http://localhost:7000/",
//export const BASE_URL = 'http://localhost:7000';
//export const GRAPHQL_URL = `${BASE_URL}/graphql`;
