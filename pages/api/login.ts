//% libs
import magicAdmin from "../../lib/magic";

import jwt from "jsonwebtoken";

import {isNewUser, createNewUser} from "../../lib/db/hasura";

import setTokenCookie from "../../lib/cookies";

//% utils
import {traceColourfulRedError} from "../../utils";

//% types
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from "next";

/**
 * @abstract Authentication route
 * @param req_
 * @param res_
 */
const login = async (req_: NextApiRequest, res_: NextApiResponse) => {
  if (req_.method === "POST") {
    try {
      // Extract and process the magic didToken from the headers with magicSdk
      const auth = req_.headers.authorization;
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

      if (typeof isNewUserQuery === "boolean") {
        if (isNewUserQuery) {
          const createNewUserMutation = await createNewUser(token, metadata);

          // Set the cookie
          setTokenCookie(token, res_);

          res_.send({done: true, msg: "is a new user"});
        } else {
          // Set the cookie
          setTokenCookie(token, res_);

          res_.send({done: true, msg: "not a new user"});
        }
      } else {
        res_.status(400).send({
          done: false,
          msg: "there was something wrong with your request",
        });
      }
    } catch (error) {
      traceColourfulRedError(error, 3);

      res_.status(500).send({done: false});
    }
  } else {
    res_.status(400).send({
      done: false,
      cause: "Invalid method, please use 'POST' in your headers instead",
    });
  }
};

export default login;
