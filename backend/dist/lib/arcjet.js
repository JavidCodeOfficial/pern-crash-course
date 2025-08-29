import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import dotenv from "dotenv";
dotenv.config();
const ARCJET_KEY = process.env.ARCJET_KEY || "";
if (!ARCJET_KEY)
    throw new Error("Database environment variables are not set!");
export const aj = arcjet({
    key: ARCJET_KEY,
    characteristics: ["ip.src"],
    rules: [
        shield({ mode: "LIVE" }),
        detectBot({ mode: "LIVE", allow: ["CATEGORY:SEARCH_ENGINE"] }),
        tokenBucket({
            mode: "LIVE",
            refillRate: 30,
            interval: 5,
            capacity: 20,
        }),
    ],
});
