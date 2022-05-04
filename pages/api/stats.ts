//% libs
import type {NextApiRequest, NextApiResponse} from "next";

//% utils
import {traceColourfulRedError} from "../../utils";

const stats = (request_: NextApiRequest, response_: NextApiResponse) => {
  if (request_.method === "POST") {
    response_.send({done: true, msg: "It works", errors: []});
  } else {
    response_.status(400).send({
      done: false,
      msg: "",
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
