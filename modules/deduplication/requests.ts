import { gql } from "@apollo/client";

export const GET_FILES_UPLOADED_BY_USERID = gql`
  query GetFilesUploadedByUserID($userID: ID!) {
    getFilesUploadedByUserID(userID: $userID) {
      uploadID
      userID
      filePaths
    }
  }
`;

export const GET_HEADERS_BY_FILENAME = gql`
  query getHeadersbyFileName($filename: String!) {
    getHeadersbyFileName(filename: $filename)
  }
`;

export const START_DEDUPE_JOB = gql`
  mutation startDedupeJob(
    $userID: ID!
    $filename: String!
    $headerselected: [String!]!
  ) {
    startDedupeJob(
      userID: $userID
      filename: $filename
      headerselected: $headerselected
    ) {
      jobID
    }
  }
`;
