import { RumorOpenAI } from "../lib/openai";
import "dotenv/config";

const rumorOpenAI = new RumorOpenAI(process.env.OPENAI_API_KEY || "");

rumorOpenAI
  .moderate(
    "nl",
    ["Natuur"],
    "De stad telt vele inwoners, elk van hen wil een plek om te wonen. Hoe zou jij willen dat er gewoond wordt in de stad van de toekomst?",
    "Huizenprijzen zijn sowieso. In de eerste plaats denk ik veel goedkopere woningen."
  )
  .then((out) => console.log(out));
