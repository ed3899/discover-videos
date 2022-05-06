//% libs
import magicAdmin from "../../lib/magic";
import {removeTokenCookie} from "../../lib/cookies";

//% utils
import {traceColourfulRedError, verifyJWT_Token} from "../../utils";

//% types
import type {NextApiRequest, NextApiResponse} from "next";

type Data = {
  done: boolean;
  errors: {id: number; cause: string}[];
};
const logout = async (
  request_: NextApiRequest,
  response_: NextApiResponse<Partial<Data>>
) => {
  switch (request_.method) {
    case "POST":
      try {
        if (!request_.cookies.token)
          return response_.status(401).json({
            done: true,
            errors: [{id: 1, cause: "User is not logged in"}],
          });

        const token = request_.cookies.token;
        const userId = await verifyJWT_Token(token);

        if (!userId)
          return response_.status(500).json({
            done: true,
            errors: [
              {
                id: 1,
                cause: `User id is ${userId}`,
              },
            ],
          });

        removeTokenCookie(response_);

        try {
          await magicAdmin.users.logoutByIssuer(userId);
        } catch (error) {
          console.log("User's session with Magic already expired");
          console.error("Error occurred while logging out magic user", error);
        }

        //redirects user to login page
        response_.writeHead(302, {Location: "/login"}).end();
      } catch (error) {
        traceColourfulRedError(error, 3);
        response_.status(500).json({
          done: false,
          errors: [
            {
              id: 1,
              cause: "Uppps, we couldn't process your request",
            },
          ],
        });
      }

      break;

    default:
      response_.status(400).json({
        done: false,
        errors: [
          {
            id: 1,
            cause:
              "Unsupported method. Please use {method: 'POST'} in your headers instead",
          },
        ],
      });
      break;
  }
};

export default logout;
