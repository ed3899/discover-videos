//% libs
import chalk from "chalk";
export const defaultImg = () => "/static/placeholder.webp";

export const weAreOnBrowser = () => typeof window !== "undefined";

/**
 * @abstract Utility for trace-logging a colourful red error
 * @param error_
 * @param indentationLevels_
 */
export const traceColourfulRedError = async (
  error_: any,
  indentationLevels_: number
) => {
  const stringifiedError = JSON.stringify(error_, null, indentationLevels_);
  const colouredError = chalk.red(stringifiedError);

  console.trace(`Something went wrong at: ${colouredError}`);
};
