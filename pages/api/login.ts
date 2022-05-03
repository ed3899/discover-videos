//% libs
import magicAdmin from "../../lib/magic";

import jwt from "jsonwebtoken";

//% types
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from "next";

type LoginDataT = {};
/**
 * @abstract Authentication
 * @param req
 * @param res
 */
const login = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      // Extract and process didToken from magic with magicSdk
      const auth = req.headers.authorization;
      const didToken = auth ? auth.substring(7) : ""; //? gracefully fail when didToken not present
      const metadata = await magicAdmin.users.getMetadataByToken(didToken);

      /**
       * @abstract Creates a jwt token
       * @summary Sets the initial date to now and the expiration date of the token 7 days in the  future in seconds.
       * @link Signature struc - https://hasura.io/docs/latest/graphql/core/auth/authentication/jwt/#the-spec
       */
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
        "somesecret"
      );

      console.log({token});

      res.send({done: true});
    } catch (error) {
      console.error(`Something went wrong
              Here's the error ${error}
              `);

      res.status(500).send({done: false});
    }
  } else {
    res.send({done: false});
  }
};

export default login;
