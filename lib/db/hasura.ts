//% libs
import chalk from "chalk";

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
    const colourfulError = chalk.red(error);
    console.trace(colourfulError);
  }
};

/**
 * @abstract Custom function for veryfing if a user exist in Hasura
 * @param token_ The JWT Token for Hasura authorization
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
    const colourfulError = chalk.red(error);
    console.trace(colourfulError);
  }
};

export default queryHasuraGraphQL;
