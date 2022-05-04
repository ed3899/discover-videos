//% libs
import type {NextApiRequest, NextApiResponse} from "next";

//% utils
import {traceColourfulRedError} from "../../utils";

type StatsApiResponseBodyT = {
  done: boolean;
  errors:
    | [
        {
          id: number;
          cause: string;
        }
      ]
    | [];
};

const stats = (
  request_: NextApiRequest,
  response_: NextApiResponse<StatsApiResponseBodyT>
) => {
  if (request_.method === "POST") {
    try {
      if (!request_.cookies.token) {
        response_.status(401).send({
          done: false,
          errors: [
            {id: 1, cause: "You're not authorized to access this content"},
          ],
        });
      }

      response_.send({done: true, errors: []});
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
