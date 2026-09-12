import PocketBase from "pocketbase";
import { POCKETBASE_URL } from "@/lib/auth-config";

const pb = new PocketBase(POCKETBASE_URL);

export default pb;
