//% utils
import {traceColourfulRedError} from "../../utils";

//% types
import type {MagicUserMetadata} from "@magic-sdk/admin";

type HasuraDataT = {
  users: unknown[];
  stats: unknown[];
};

type HasuraSuccessT = {
  data: Partial<HasuraDataT>;
};

type HasuraErrorT = {
  errors: unknown[];
};

/**
 * @abstract Base function for querying hasura graphql
 * @param graphQL_Query_ The string formatted query
 * @param queryName_ Name for the query
 * @param variables_ Variables for the GraphQL query
 * @param token_ The raw JWT Token for Hasura authorization
 * @returns
 */
const queryHasuraGraphQL = async (
  graphQL_Query_: string,
  queryName_: string,
  variables_: Record<string, any>,
  token_: string
) => {
  try {
    // Main entry point for the graph QL server
    const res = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL!, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token_}`,
      },
      body: JSON.stringify({
        query: graphQL_Query_,
        variables: variables_,
        operationName: queryName_,
      }),
    });

    const jsonData = (await res.json()) as HasuraSuccessT | HasuraErrorT;

    if ((jsonData as HasuraErrorT).errors) {
      // Format and stringify error
      const hasuraErrors = JSON.stringify(
        (jsonData as HasuraErrorT).errors,
        null,
        3
      );

      throw new Error(
        `There was an error in the Hasura response: ${hasuraErrors}`
      );
    } else {
      return jsonData as HasuraSuccessT;
    }
  } catch (error) {
    traceColourfulRedError(error, 3);
  }
};

/**
 * @abstract Custom function for veryfing if a user exist in Hasura
 * @param token_ The JWT Token for Hasura authorization
 * @param issuer_ The user that will be checked against the Hasura database
 * @returns Boolean refering to the user/issuer_ existance. Undefined if there were any errors
 */
export const isNewUser = async (token_: string, issuer_: string) => {
  // GraphQL Query
  const graphQL_Query = `
  query isNewUser($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {
      id
      email
      issuer
    }
  }
`;

  try {
    const res = await queryHasuraGraphQL(
      graphQL_Query,
      "isNewUser",
      {issuer: issuer_},
      token_
    );

    //? Maybe customize an error
    if (res?.data?.users) {
      // Verifies if the array is empty
      return res.data.users.length === 0;
    }
  } catch (error) {
    traceColourfulRedError(error, 3);
  }
};

/**
 * @abstract Custom function for creating a new user in Hasura database
 * @param token_ The raw JWT Token for Hasura authorization
 * @param metadata_ The metadata obtained from the DID token once it has been proccessed by the magic SDK
 * @returns
 */
export const createNewUser = async (
  token_: string,
  metadata_: MagicUserMetadata
) => {
  const {
    issuer: issuer_,
    email: email_,
    publicAddress: publicAddress_,
  } = metadata_;

  // GraphQL query
  const graphQL_Query = `
  mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      returning {
        email
        id
        issuer
      }
    }
  }
`;

  try {
    const res = await queryHasuraGraphQL(
      graphQL_Query,
      "createNewUser",
      {issuer: issuer_, email: email_, publicAddress: publicAddress_},
      token_
    );

    return res;
  } catch (error) {
    traceColourfulRedError(error, 3);
  }
};

/**
 * @abstract Custom function for finding a video by user id
 * @param token_ The raw JWT Token for Hasura authorization
 * @param userId_ The user id extracted from the decoded JWT
 * @param videoId_ The video id
 * @returns Boolean refering to the videoId by user existance. Undefined if there were any errors
 */
export const findVideoIdByUser = async (
  token_: string,
  userId_: string,
  videoId_: string
) => {
  const graphQL_Query = `
  query findVideoIdByUserId($userId: String!, $videoId: String!) {
    stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
      id
      userId
      videoId
      watched
      favourited
    }
  }
`;

  try {
    const res = await queryHasuraGraphQL(
      graphQL_Query,
      "findVideoIdByUserId",
      {videoId: videoId_, userId: userId_},
      token_
    );

    if (res?.data.stats) {
      // Verify array length
      return res.data.stats.length > 0;
    }
  } catch (error) {
    traceColourfulRedError(error, 3);
  }
};

export const insertStatsOne = async () => {
  const graphQL_Mutation = `
  mutation insertStatsOne($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
    insert_stats_one(object: {favourited: $favourited, userId: $userId, videoId: $videoId, watched: $watched}) {
      favourited
      id
      userId
      videoId
      watched
    }
  }
`;
};

type UpdateStats_QueryVarsParamT = {
  favourited: number;
  userId: string;
  watched: boolean;
  videoId: string;
};
/**
 * @abstract
 * @param token_ The raw JWT token
 */
export const updateStats = async (
  token_: string,
  queryVars: UpdateStats_QueryVarsParamT
) => {
  const {
    favourited: favourited_,
    userId: userId_,
    watched: watched_,
    videoId: videoId_,
  } = queryVars;

  const graphQL_Mutation = `
  mutation updateStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
  update_stats(_set: {watched: $watched, favourited: $favourited}, 
    where: {videoId: {_eq: $videoId}, userId: {_eq: $userId}}) {
    favourited,
    userId,
    watched,
    videoId
    }
  }
  `;

  const response = await queryHasuraGraphQL(
    graphQL_Mutation,
    "updateStats",
    {
      favourited: favourited_,
      userId: userId_,
      watched: watched_,
      videoId: videoId_,
    },
    token_
  );

  console.log({response});
  
  return response;
};

export default queryHasuraGraphQL;
