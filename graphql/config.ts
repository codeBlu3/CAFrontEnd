import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "http://localhost:7000/",
  cache: new InMemoryCache(),
});

//export const BASE_URL = 'http://localhost:7000';
//export const GRAPHQL_URL = `${BASE_URL}/graphql`;
