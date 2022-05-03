//% libs
import magicAdmin from "../../lib/magic";

//% types
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from "next";

type LoginDataT = {};
/**
 * @abstract Authentication
 * @param req 
 * @param res 
 */
const login = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      //Extract and process token
      const auth = req.headers.authorization;
      const didToken = auth ? auth.substring(7) : "";
      const metadata = await magicAdmin.users.getMetadataByToken(didToken);

      console.log({metadata});

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
