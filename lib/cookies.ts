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

export default setTokenCookie;
