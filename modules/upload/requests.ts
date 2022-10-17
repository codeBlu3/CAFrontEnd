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

export const ATTACH_FILEUPLOAD_TO_USERID = gql`
  mutation attachFileUploadToUserID($userID: ID!, $filepath: String!) {
    attachFileUploadToUserID(userID: $userID, filepath: $filepath) {
      uploadID
    }
  }
`;
