//% libs
import {Magic} from "@magic-sdk/admin";

// Initialize magic instance for the server
const magicAdmin = new Magic(process.env.MAGIC_SECRET_KEY!);

export default magicAdmin;
