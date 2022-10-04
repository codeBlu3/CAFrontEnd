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

export const ATTACH_IMAGE_TO_RECIPE = gql`
  mutation AttachImageToRecipe(
    $recipeID: ID!
    $imageArrayInput: [ImageInput!]!
  ) {
    attachImageToRecipe(
      recipeID: $recipeID
      imageArrayInput: $imageArrayInput
    ) {
      recipeID
    }
  }
`;

