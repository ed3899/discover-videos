//% libs
import magicAdmin from "../../lib/magic";

import jwt from "jsonwebtoken";

import {isNewUser} from "../../lib/db/hasura";

//% types
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from "next";

/**
 * @abstract Authentication route
 * @param req
 * @param res
 */
const login = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      // Extract and process the magic didToken from the headers with magicSdk
      const auth = req.headers.authorization;
      const didToken = auth ? auth.substring(7) : ""; //? gracefully fail when didToken not present
      const metadata = await magicAdmin.users.getMetadataByToken(didToken);

      // Create a jwt token using metadata from the didToken, sets the initial date to now and the expiration date of the token 7 days in the  future in seconds. This way, the user will only be able to access his/her data. For more information about the signature struc, please refer to https://hasura.io/docs/latest/graphql/core/auth/authentication/jwt/#the-spec
      const token = jwt.sign(
        {
          ...metadata,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": `${metadata.issuer!}`,
          },
        },
        process.env.HASURA_GRAPHQL_JWT_SECRET!
      );

      // Check if user exists
      const isNewUserQuery = await isNewUser(token, metadata.issuer!);

      res.send({done: true, isNewUserQuery});
    } catch (error) {
      console.error(`Something went wrong
              Here's the error ${error}
              `);

      console.trace(error);

      res.status(500).send({done: false});
    }
  } else {
    res.send({done: false});
  }
};

export default login;
