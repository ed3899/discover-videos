//% libs
import type {NextApiRequest, NextApiResponse} from "next";

import {
  findVideoIdByUser,
  insertStatsOne,
  updateStats,
} from "../../lib/db/hasura";

//% utils
import {verifyJWT_Token} from "../../utils";

//% types
import type {JSON_DecodedTokenT} from "../../types";

export type StatsApiResponseBodyT = {
  done: boolean;
  decodedJWT_Token: JSON_DecodedTokenT;
  response: unknown; //?
  errors:
    | [
        {
          id: number;
          cause: string;
        }
      ]
    | [];
};

const stats = async (
  request_: NextApiRequest,
  response_: NextApiResponse<Partial<StatsApiResponseBodyT>>
) => {
  try {
    const {token: token_} = request_.cookies;
    const {favourited: favourited_, watched: watched_ = true} = request_.body;
    const {videoId: videoId_} = request_.query;

    if (!token_) {
      response_.status(401).send({
        done: false,
        errors: [
          {id: 1, cause: "You're not authorized to access this content"},
        ],
      });
    }

    if (!videoId_) {
      response_.status(400).send({
        done: false,
        errors: [
          {
            id: 1,
            cause: "No video id was provided in the body of the request",
          },
        ],
      });
    }

    const userId_ = verifyJWT_Token(token_);

    if (typeof userId_ === "undefined") {
      return response_.status(400).send({
        done: true,
        response: userId_,
        errors: [
          {id: 1, cause: `User id obtained from JWT Token was ${userId_}`},
        ],
      });
    }

    const findVideo_ = await findVideoIdByUser(
      token_,
      userId_,
      videoId_ as string
    );

    if (typeof findVideo_ === "undefined") {
      response_.status(400).send({
        done: false,
        response: findVideo_,
        errors: [
          {
            id: 1,
            cause: `There was an error while finding the video by user. ${findVideo_} response`,
          },
        ],
      });
    }

    const doesStatsExist_ = findVideo_!.length > 0;

    switch (request_.method) {
      case "POST":
        if (doesStatsExist_) {
          // Update video stats
          const updatedStats_ = await updateStats(token_, {
            favourited: favourited_,
            watched: watched_,
            userId: userId_,
            videoId: videoId_ as string,
          });

          if (typeof updatedStats_ === "undefined") {
            return response_.status(400).send({
              done: false,
              response: updatedStats_,
              errors: [
                {
                  id: 1,
                  cause: `There was an error updating the stats. ${updatedStats_} response`,
                },
              ],
            });
          }

          return response_.status(200).send({
            done: true,
            response: updatedStats_,
            errors: [],
          });
        } else {
          // Create video stats
          const insertedStats_ = await insertStatsOne(token_, {
            favourited: favourited_,
            watched: watched_,
            userId: userId_,
            videoId: videoId_ as string,
          });

          if (typeof insertedStats_ === "undefined") {
            return response_.status(400).send({
              done: false,
              response: insertedStats_,
              errors: [
                {
                  id: 1,
                  cause: `There was an error creating video stats. ${insertedStats_} response`,
                },
              ],
            });
          }

          return response_.status(200).send({
            done: true,
            response: insertedStats_,
            errors: [],
          });
        }

      case "GET":
        if (doesStatsExist_) {
          return response_.status(200).send({
            done: true,
            response: findVideo_,
            errors: [],
          });
        } else {
          return response_.status(200).send({
            done: true,
            response: "Video not found",
            errors: [],
          });
        }

      default:
        return response_.status(400).send({
          done: false,
          errors: [
            {
              id: 1,
              cause:
                "Invalid method. Please use {method : 'POST'} or {method : 'GET'} on your headers.",
            },
          ],
        });
    }
  } catch (error) {
    response_.status(500).send({
      done: false,
      errors: [
        {
          id: 1,
          cause: `Something went internally wrong. Here's the error ${error}`,
        },
      ],
    });
  }
};

export default stats;
