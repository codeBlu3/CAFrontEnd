import { gql } from "@apollo/client";

// convert to paginated -- machine learning driven
export const GET_RECIPES_QUERY = gql`
  query GetRecipes {
    getRecipes {
      recipeID
      recipeFoodieID
      recipeName
    }
  }
`;
export const GET_STORE_RECIPES = gql`
  query GetRecipes {
    getRecipes {
      recipeID
      recipeName
      recipeDescription
      recipePrice
      images {
        imagePath
      }
    }
  }
`;
//recipeName
//cache?
export const GET_RECIPE_BY_ID = gql`
  query GetAllRecipeByID($recipeId: ID!) {
    getRecipeById(recipeId: $recipeId) {
      recipeID
      recipeName
      recipeDescription
      recipePrice
      images {
        imagePath
      }
    }
  }
`;

export const ADD_RECIPE = gql`
  mutation AddRecipe($recipeInput: RecipeInput!) {
    addRecipe(recipeInput: $recipeInput) {
      recipeID
    }
  }
`;
export const EDIT_RECIPE = gql`
  mutation EditRecipe($recipeID: ID!, $recipeInput: RecipeInput!) {
    editRecipe(recipeID: $recipeID, recipeInput: $recipeInput) {
      recipeID
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

// messages
export const GET_ALL_CONVO = gql`
  query GetAllConvo {
    getAllConvo {
      conversationID
    }
  }
`;
export const GET_ALL_CONVO_BY_USERID = gql`
  query GetAllConvo {
    getAllConvo {
      conversationID
      members
    }
  }
`;

export const GET_CONVO_BY_ID = gql`
  query GetConvoById($conversationID: ID!) {
    getConvoById(conversationID: $conversationID) {
      conversationID
      messages {
        sender
        text
      }
    }
  }
`;
export const GET_CONVO_BY_MEMBERS = gql`
  query GetConvoByMembers($conversationMembers: [String!]!) {
    getConvoByMembers(conversationMembers: $conversationMembers) {
      conversationID
    }
  }
`;

export const ADD_CONVO = gql`
  mutation AddConvo($conversationMembers: [String!]!) {
    addConvo(conversationMembers: $conversationMembers) {
      conversationID
    }
  }
`;

export const FIND_OR_CREATE_CONVO_BY_MEMBERS = gql`
  mutation FindOrCreateConvoByMembers($conversationMembers: [String!]!) {
    findOrCreateConvoByMembers(conversationMembers: $conversationMembers) {
      conversationID
    }
  }
`;
