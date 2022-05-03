/**
 * @abstract Base function for querying hasura graphql
 * @param operationsDoc_ The string formatted query
 * @param operationName_
 * @param variables_ Variables for the query
 * @param token_ The JWT Token for Hasura authorization
 * @returns
 */
const queryHasuraGraphQL = async (
  operationsDoc_: string,
  operationName_: string,
  variables_: Record<string, any>,
  token_: string
) => {
  const res = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL!, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token_}`,
    },
    body: JSON.stringify({
      query: operationsDoc_,
      variables_,
      operationName_,
    }),
  });
  const jsonData = await res.json();

  return jsonData;
};

/**
 * @abstract Custom function for veryfing if a user exist in Hasura
 * @param token_ The JWT Token for Hasura authorization
 * @returns
 */
export const isNewUser = async (token_: string) => {
  type HasuraResponseT = {
    data: {
      users: any[];
    };
  };

  //! Hardcoded issuer
  const operation = `
  query MyQuery {
    users(where: {issuer: {_eq: "0"}}) {
      id
      email
      issuer
    }
  }
`;

  const res = (await queryHasuraGraphQL(
    operation,
    "MyQuery",
    {},
    token_
  )) as HasuraResponseT;

  // Verifies if the array is empty
  return res.data.users.length === 0;
};

export default queryHasuraGraphQL;
