//% libs
import chalk from "chalk";
import jwt from "jsonwebtoken";

//% types
import type {JSON_DecodedTokenT} from "../types";

export const defaultImg = () => "/static/placeholder.webp";

export const weAreOnBrowser = () => typeof window !== "undefined";

/**
 * @abstract Utility for trace-logging a colourful red error.
 * @summary It stringifies the error with JSON.stringify and colours it using chalk. This may cause
 * unwanted formatting
 * @param error_
 * @param indentationLevels_
 */
export const traceColourfulRedError = (
  error_: any,
  indentationLevels_: number
) => {
  const stringifiedError = JSON.stringify(error_, null, indentationLevels_);
  const colouredError = chalk.red(stringifiedError);
  const formatedError = `${chalk.bold.bgBlack.redBright(
    "Something went wrong at"
  )}: ${colouredError}`;

  console.trace(formatedError);
};

/**
 * @abstract Verifies a JWT token
 * @requires HASURA_GRAPHQL_JWT_SECRET .Read from .env.local(environment variables) file at the root of the project
 * @param token_
 * @returns The issuer of the token
 */
export const verifyJWT_Token = (token_: string) => {
  if (token_) {
    const decodedJWT_Token_ = jwt.verify(
      token_,
      process.env.HASURA_GRAPHQL_JWT_SECRET!
    ) as JSON_DecodedTokenT;
    const userId_ = decodedJWT_Token_.issuer;
    return userId_;
  }
};
