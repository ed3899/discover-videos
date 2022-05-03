const fetchGraphQL = async (
  operationsDoc_: string,
  operationName_: string,
  variables_: Record<string, any>
) => {
  const res = await fetch("https://real-maggot-86.hasura.app/v1/graphql", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_API_KEY!,
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

const operation = `
    query MyQuery {
      users {
        id
      }
    }
  `;

const fetchMyQuery = async () => {
  const res = await fetchGraphQL(operation, "MyQuery", {}).catch(error =>
    console.error(`Error at fetchMyQuery ${error}`)
  );

  if (res.errors) console.error(res.errors);

  console.log(res.data);
};

export default fetchMyQuery;
