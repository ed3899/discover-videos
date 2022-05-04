export type JSON_DecodedTokenT = {
  issuer: string;
  publicAddress: string;
  email: string;
  oauthProvider: null;
  phoneNumber: null;
  iat: number;
  exp: number;
  "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": string[];
    "x-hasura-default-role": string;
    "x-hasura-user-id": string;
  };
};
