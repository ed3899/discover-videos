//% libs
import {NextResponse} from "next/server";
import jwt from "jsonwebtoken";
//% types
import type {NextRequest} from "next/server";
import type {JSON_DecodedTokenT} from "../types";

export function middleware(req_: NextRequest) {
  //check token
  const token = req_.cookies.token ?? false;

  // Wasn't able to import verifyJWT_Token because of navigator undefined
  const decodedJWT_Token_ = jwt.verify(
    token,
    process.env.HASURA_GRAPHQL_JWT_SECRET!
  ) as JSON_DecodedTokenT;

  const userId = decodedJWT_Token_.issuer;

  const {pathname} = req_.nextUrl.clone();

  if (
    (token && userId) ||
    pathname.includes(`/api/login`) ||
    pathname.includes("/static")
  ) {
    console.log("Firt If");
    return NextResponse.next();
  }

  if (!token && pathname !== `/login`) {
    console.log("Second if");
    return NextResponse.redirect(`/login`);
  }
}
