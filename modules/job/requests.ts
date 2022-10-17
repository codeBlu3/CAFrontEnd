import { gql } from "@apollo/client";

export const GET_JOBS_BY_USERID = gql`
  query getJobsByUserID($userID: ID!) {
    getJobsByUserID(userID: $userID) {
      jobID
      jobType
    }
  }
`;

export const GET_MATCHESDATA_BY_JOBID = gql`
  query getMatchesDataByJobID($jobID: ID!) {
    getMatchesDataByJobID(jobID: $jobID) {
      Kdistance
      DatabaseData
      QueryData
    }
  }
`;
