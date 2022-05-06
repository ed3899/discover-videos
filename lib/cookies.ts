//% libs
import cookie from "cookie";

//% types
import {NextApiResponse} from "next";

const setTokenCookie = (token_: string, res: NextApiResponse) => {
  const maxAge = 7 * 24 * 60 * 60;
  // Multiplied by 1000 because we need milliseconds
  const expires = new Date(Date.now() + maxAge * 1000);
  const setCookie = cookie.serialize("token", token_, {
    maxAge,
    expires,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.setHeader("Set-Cookie", setCookie);
};

/**
 * @abstract Clears out the token=**** cookie from the NextApiResponse
 * @param res_
 */
export const removeTokenCookie = (res_: NextApiResponse) => {
  const val = cookie.serialize("token", "", {
    maxAge: -1,
    path: "/",
  });

  res_.setHeader("Set-Cookie", val);
};

export default setTokenCookie;
