/**
 * This class is used to handle the mqtt topics
 */

// import { startSession } from "../../controllers/audio";
import SoundBoard from "../audio/SoundBoard";
import { Exception } from "../exceptions/Exception";
import Logger from "../logging/Logger";
import SettingHelper from "../settings/SettingHelper";

export class MqttTopicHandler {
  public static async handleTopic(
    topic: string,
    message: string = "",
    onFrontendTrigger?: (message: string, payload?: any) => void
  ) {
    // convert the message to a json object
    const json = JSON.parse(message);

    // create the method name
    const defaultMethod = `handleTopic`;

    // create the method to call
    const methodToCall: string = topic
      .split("/")
      .reduce(
        (accumulator: string, currentString: string) =>
          accumulator +
          currentString.charAt(0).toUpperCase() +
          currentString.slice(1),
        ""
      );

    // call the method
    const methodName = `${defaultMethod}${methodToCall}`;
    if (Object.prototype.hasOwnProperty.call(MqttTopicHandler, methodName)) {
      // @ts-ignore
      await MqttTopicHandler[methodName as keyof typeof MqttTopicHandler](
        json,
        onFrontendTrigger
      );
    }
  }

  /**
   * Handle the topic recorder/startSession
   * @param json
   */
  public static async handleTopicRecorderStartSession(
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    json = {},
    onFrontendTrigger?: (message: string, payload?: any) => void
  ) {
    try {
      // start a new session, trigger frontend if a soundscape needs to be played
      await SoundBoard.startSession((soundscape) => {
        if (onFrontendTrigger) onFrontendTrigger("play-soundscape", soundscape);
      });

      // let the frontend know
      if (onFrontendTrigger) onFrontendTrigger("session-started", {});

      // Log
      Logger.success("Session started.");
    } catch (e: any) {
      throw new Exception({
        where: "handleTopicRecorderStartSession",
        message: e.message,
      });
    }
  }

  /**
   * Handle the topic recorder/stopSession
   * @param json
   */
  public static async handleTopicRecorderStopSession(
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    json = {},
    onFrontendTrigger?: (message: string, payload?: any) => void
  ) {
    try {
      // stop the playlist
      await SoundBoard.destroy();

      // ask the frontend to cleanup the soundscape
      if (onFrontendTrigger) {
        onFrontendTrigger("session-stopped");
      }

      // log
      await Logger.warn("Session force stopped.");
    } catch (e: any) {
      throw new Exception({
        where: "handleTopicRecorderStopSession",
        message: e.message,
      });
    }
  }

  /**
   * Handle the topic recorder/nextVoiceOver
   * @param json
   */
  public static async handleTopicRecorderNextVoiceOver() {
    try {
      if (SoundBoard.VOPlaylist) SoundBoard.VOPlaylist.next();
    } catch (e: any) {
      throw new Exception({
        where: "handleTopicRecorderNextVoiceOver",
        message: e.message,
      });
    }
  }

  /**
   * Handle the topic recorder/setLanguage
   * @param json
   */
  public static async handleTopicRecorderSetLanguage(json: any) {
    try {
      if (json.language) {
        await SettingHelper.setSetting("language", json.language);
      }
    } catch (e: any) {
      throw new Exception({
        where: "handleTopicRecorderSetLanguage",
        message: e.message,
      });
    }
  }
}
