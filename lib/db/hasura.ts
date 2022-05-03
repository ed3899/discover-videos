//% utils
import {traceColourfulRedError} from "../../utils";

//% types
import type {MagicUserMetadata} from "@magic-sdk/admin";

/**
 * @abstract Base function for querying hasura graphql
 * @param operationsDoc_ The string formatted query
 * @param operationName_ Name for the query
 * @param variables_ Variables for the query
 * @param token_ The JWT Token for Hasura authorization
 */
const queryHasuraGraphQL = async (
  operationsDoc_: string,
  operationName_: string,
  variables_: Record<string, any>,
  token_: string
) => {
  type HasuraSuccessT = {
    data: {
      users: any[];
    };
  };

  type HasuraErrorT = {
    errors: any[];
  };

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL!, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token_}`,
      },
      body: JSON.stringify({
        query: operationsDoc_,
        variables: variables_,
        operationName: operationName_,
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
  const operationsDoc = `
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
      operationsDoc,
      "isNewUser",
      {issuer: issuer_},
      token_
    );

    //? Maybe customize an error

    // Verifies if the array is empty
    return res!.data.users.length === 0;
  } catch (error) {
    traceColourfulRedError(error, 3);
  }
};

export const createNewUser = async (
  token_: string,
  metadata_: MagicUserMetadata
) => {
  const {
    issuer: issuer_,
    email: email_,
    publicAddress: publicAddress_,
  } = metadata_;

  const operationsDoc = `
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
      operationsDoc,
      "createNewUser",
      {issuer: issuer_, email: email_, publicAddress: publicAddress_},
      token_
    );

    return res;
  } catch (error) {
    traceColourfulRedError(error, 3);
  }
};

export default queryHasuraGraphQL;
