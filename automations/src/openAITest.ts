import { RumorOpenAI } from "../lib/openai";
import "dotenv/config";

const rumorOpenAI = new RumorOpenAI(process.env.OPENAI_API_KEY || "");

rumorOpenAI
  .generateText(
    "You are a helpful assistant",
    "who is the president of the united states?"
  )
  .then((d) => console.log(d));
