function fetchGraphQL(
  operationsDoc: string,
  operationName: string,
  variables: Record<string, any>
) {
  return fetch("https://real-maggot-86.hasura.app/v1/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: operationsDoc,
      variables,
      operationName,
    }),
  }).then(result => result.json());
}

const operation = `
    query MyQuery {
      users {
        id
      }
    }
  `;

export function fetchMyQuery() {
  return fetchGraphQL(operation, "MyQuery", {});
}

// fetchMyQuery()
//   .then(({data, errors}) => {
//     if (errors) {
//       console.error(errors);
//     }
//     console.log(data);
//   })
//   .catch(error => {
//     console.error(error);
//   });
