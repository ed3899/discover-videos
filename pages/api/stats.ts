//% libs
import type {NextApiRequest, NextApiResponse} from "next";

import jwt from "jsonwebtoken";

import {
  findVideoIdByUser,
  insertStatsOne,
  updateStats,
} from "../../lib/db/hasura";

//% utils
import {traceColourfulRedError} from "../../utils";

//% types
import type {JSON_DecodedTokenT} from "../../types";

type StatsApiResponseBodyT = {
  done: boolean;
  decodedJWT_Token: JSON_DecodedTokenT;
  response: unknown;
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
  if (request_.method === "POST") {
    try {
      const {token: token_} = request_.cookies;
      const {
        videoId: videoId_,
        favourited: favourited_,
        watched: watched_ = true,
      } = request_.body;

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

      const decodedJWT_Token_ = jwt.verify(
        token_,
        process.env.HASURA_GRAPHQL_JWT_SECRET!
      ) as JSON_DecodedTokenT;
      const userId_ = decodedJWT_Token_.issuer;

      const doesStatsExist_ = await findVideoIdByUser(
        token_,
        userId_,
        videoId_
      );

      //? Maybe change the conditionals, too much else nesting. We may be able to do with less
      if (typeof doesStatsExist_ === "boolean") {
        if (doesStatsExist_) {
          // Update video stats
          const updatedStats_ = await updateStats(token_, {
            favourited: favourited_,
            watched: watched_,
            userId: userId_,
            videoId: videoId_,
          });

          if (updatedStats_) {
            response_.status(200).send({
              done: true,
              decodedJWT_Token: decodedJWT_Token_,
              response: updatedStats_,
              errors: [],
            });
          } else {
            // Undefined response
            response_.status(400).send({
              done: false,
              decodedJWT_Token: decodedJWT_Token_,
              response: updatedStats_,
              errors: [
                {
                  id: 1,
                  cause: `There was an error updating the stats. ${updatedStats_} response`,
                },
              ],
            });
          }
        } else {
          // Create video stats
          const insertedStats_ = await insertStatsOne(token_, {
            favourited: favourited_,
            watched: watched_,
            userId: userId_,
            videoId: videoId_,
          });

          if (insertedStats_) {
            response_.status(200).send({
              done: true,
              decodedJWT_Token: decodedJWT_Token_,
              response: insertedStats_,
              errors: [],
            });
          } else {
            // Undefined response
            response_.status(400).send({
              done: false,
              decodedJWT_Token: decodedJWT_Token_,
              response: insertedStats_,
              errors: [
                {
                  id: 1,
                  cause: `There was an error creating video stats. ${insertedStats_} response`,
                },
              ],
            });
          }
        }
      } else {
        //Undefined response
        response_.status(400).send({
          done: false,
          decodedJWT_Token: decodedJWT_Token_,
          response: doesStatsExist_,
          errors: [
            {
              id: 1,
              cause: `There was an error while finding the video by user. ${doesStatsExist_} response`,
            },
          ],
        });
      }
    } catch (error_) {
      const typedError_ = error_ as InstanceType<typeof Error>;

      traceColourfulRedError(typedError_.message, 3);

      response_.status(500).send({
        done: false,
        errors: [{id: 1, cause: typedError_.message}],
      });
    }
  } else {
    response_.status(400).send({
      done: false,
      errors: [
        {
          id: 1,
          cause:
            "Invalid method. Please use {method : 'POST'} in your headers.",
        },
      ],
    });
  }
};

export default stats;
