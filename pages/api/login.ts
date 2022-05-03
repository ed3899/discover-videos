// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from "next";

type LoginDataT = {};

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const auth = req.headers.authorization;
      const token = auth ? auth.substring(7) : "";
      console.log({token});

      res.send({done: true});
    } catch (error) {
      console.error(`Something went wrong
              Here's the error ${error}
              `);

      res.status(500).send({done: false});
    }
  } else {
    res.send({done: false});
  }
};

export default login;
