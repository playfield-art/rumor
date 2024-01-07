import {
  getLanguageRelationId,
  getNextUnmoderatedSessions,
  moderateAnswer,
  updateSessionModeratedWithAI,
} from "../lib/cms";
import { RumorOpenAI } from "../lib/openai";
import "dotenv/config";
import { GetNextUnmoderatedSessionsQuery } from "cms-types/gql/graphql";
import chalk from "chalk";
import { updatePreviousMessage } from "../lib/utils";
import { GoogleTranslate } from "../lib/translate";
import readline from "readline";

/**
 * Variables
 */

const rumorOpenAI = new RumorOpenAI(process.env.OPENAI_API_KEY || "");
const googleTranslate = new GoogleTranslate(
  process.env.GOOGLE_CLOUD_API_KEY,
  process.env.GOOGLE_CLOUD_PROJECT_ID
);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let amountOfSessions = 0;

/**
 * Interfaces
 */
interface LogOptions {
  title?: boolean;
  updatePrevious?: boolean;
  addReturn?: boolean;
}

/**
 * A simple log function
 * @param message
 * @returns
 */
const log = (
  message,
  { title, updatePrevious, addReturn }: LogOptions = {
    title: false,
    updatePrevious: false,
    addReturn: false,
  }
) => {
  if (updatePrevious) updatePreviousMessage(message);
  else console.log(message);
  if (title) {
    console.log("--------------------------------------------------");
  }
  if (addReturn) {
    console.log("");
  }
};

/**
 * Get unmoderated sessions
 * @returns
 */
const getUnmoderatedSessions =
  async (): Promise<GetNextUnmoderatedSessionsQuery> => {
    return await getNextUnmoderatedSessions();
  };

/**
 * Moderate answer
 */
const normalizeAnswerQuestion = (
  questionTitle: string,
  answer: string,
  language: string
) => {
  if (questionTitle.startsWith("INTRO")) {
    if (language === "nl") return "Beeld je een kleur in, welke kleur zie je?";
    if (language === "en") return "Imagining a color, what color do you see?";
  }
  if (questionTitle.startsWith("OUTRO-QU1")) {
    if (language === "nl")
      return "Beschrijf in één woord het gevoel dat je hebt bij het verbeelden van de toekomst.";
    if (language === "en")
      return "In one word, describe the feeling you have when imagining the future.";
  }
  return answer;
};

/**
 * Ask for a number in terminal
 * @returns
 */
const askForNumber = () => {
  return new Promise<number>((resolve, reject) => {
    rl.question("Max. amount of sessions: ", (input) => {
      const number = parseInt(input);
      if (isNaN(number)) {
        reject(new Error("Invalid number"));
      } else {
        resolve(number);
      }
    });
  });
};

/**
 * Automoderate sessions
 */
const autoModerateSessions = async (amount: number) => {
  // loop over
  for (let i = 0; i < Math.ceil(amount) / 10; i++) {
    /**
     * Step 1 - Fetch sessions
     */

    // Fetching sessions
    log("Fetching Sessions...");
    const unmoderatedSessions = (await getUnmoderatedSessions()).sessions.data;
    log(
      `Fetching Sessions... ` +
        chalk.green(
          `${chalk.green(`${unmoderatedSessions.length} sessions`)}`
        ) +
        " fetched.",
      {
        updatePrevious: true,
      }
    );

    // validate if we have sessions to moderate
    if (unmoderatedSessions.length === 0) break;

    // leave space
    log("");

    // loop over sessions
    for (const session of unmoderatedSessions) {
      // log out the session title
      log(
        `Sessions left ${amountOfSessions} - #${session.id} - Working on session id ${session.attributes.session_id}`,
        {
          title: true,
        }
      );

      /**
       * Step 2 - Get language relation ID
       */

      const languageRelationId = await getLanguageRelationId(
        session.attributes.language
      );

      // loop over answers
      for (const answer of session.attributes.answers) {
        log(`Working on answer ${answer.id}...`);

        /**
         * Step 3 - Generate the moderated answer
         */
        const moderatedAnswer = await rumorOpenAI.moderate(
          session.attributes.language,
          answer.question.data.attributes.question_tags.data.map(
            (tag) => tag.attributes.name
          ),
          normalizeAnswerQuestion(
            answer.question.data.attributes.title,
            answer.question.data.attributes.description,
            session.attributes.language
          ),
          answer.moderated_transcript
        );

        /**
         * Step 4 - Translate the moderated answer
         */

        let commonLanguage = moderatedAnswer;
        if (moderatedAnswer) {
          try {
            if (session.attributes.language !== "en") {
              commonLanguage = await googleTranslate.translate(
                moderatedAnswer,
                "en"
              );
            }
          } catch (e) {
            log(
              chalk.red(
                `ERROR: somthing went wrong while translating ${e.message}`
              )
            );
          }
        }
        if (moderatedAnswer && !commonLanguage) {
          log(
            chalk.yellow(
              `WARNING: moderated answer but no common language found`
            )
          );
        }

        /**
         * Step 5 - Update the moderated answer in the CMS
         */

        if (moderatedAnswer && commonLanguage) {
          await moderateAnswer(answer.id, moderatedAnswer, commonLanguage);
        }

        log(
          `Working on answer ${answer.id}...${
            moderatedAnswer ? chalk.green(`done`) : chalk.red(`empty`)
          }.`,
          {
            updatePrevious: true,
          }
        );

        // add a delay for debug purpose

        // const delay = (ms: number) =>
        //   new Promise((resolve) => setTimeout(resolve, ms));

        // await delay(1000);
      }

      /**
       * Step 6 - Update the session
       */

      await updateSessionModeratedWithAI(session.id, languageRelationId);

      // decrease session amount
      amountOfSessions = amountOfSessions - 1;

      // add return
      log("");
    }
  }
};

/**
 * The main program
 */
const main = async () => {
  while (amountOfSessions > 0) {
    try {
      await autoModerateSessions(amountOfSessions);
    } catch (e) {
      log("");
      log(chalk.red(`ERROR: ${e.message}`));
      log("");
    }
  }
};

// run the program
log("playField. Rumor - Auto Moderation", { title: true, addReturn: true });
askForNumber().then((number) => {
  amountOfSessions = number;
  log("");
  main().then(() => {
    log("");
    log(chalk.green("Auto moderation completed."));
  });
});
