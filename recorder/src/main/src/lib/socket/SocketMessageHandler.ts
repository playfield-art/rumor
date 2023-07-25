/**
 * This class is used to handle the messages coming from the socket
 */

import { SocketMessage } from "@shared/interfaces";
import SettingHelper from "../settings/SettingHelper";
import { startSession, stopSession } from "../../controllers/audio";
import SoundBoard from "../audio/SoundBoard";
import { MqttSingleton } from "../mqtt/MqttSingleton";
import Logger from "../logging/Logger";

export class SocketMessageHandler {
  /**
   * Handle incoming socket messages
   * @param message The message
   * @param payload The payload
   */
  public static async handleMessage({ message, payload }: SocketMessage) {
    // convert the message to a json object
    const json = JSON.parse(payload.toString());

    // create the method name
    const defaultMethod = `handleMessage`;

    // create the method to call
    const methodToCall: string = message
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
    if (
      Object.prototype.hasOwnProperty.call(SocketMessageHandler, methodName)
    ) {
      // @ts-ignore
      await SocketMessageHandler[
        methodName as keyof typeof SocketMessageHandler
      ](json);
    }
  }

  /**
   * Set the language via settings
   * @param json
   */
  public static async handleMessageSetLanguage(json: any) {
    // validate
    if (json.language) {
      // save the setting
      await SettingHelper.saveSetting({
        key: "language",
        value: json.language,
      });

      // log
      Logger.info(`Language has been changed to "${json.language}".`);
    }
  }

  /**
   * Handle start session
   * @param json
   */
  public static handleMessageStartSession() {
    if (!SoundBoard.sessionRunning) {
      startSession();
    }
  }

  /**
   * Handle stop session
   * @param json
   */
  public static handleMessageStopSession() {
    if (SoundBoard.sessionRunning) {
      stopSession();
    }
  }

  /**
   * Handle screen
   * @param json
   */
  public static async handleMessageScreen(json: any) {
    // publish to mqtt
    await MqttSingleton.getInstance().publish("interface/screen", {
      state: json.state ? 1 : 0,
    });

    // log
    Logger.detail(`Interface screen is turned ${json.state ? "on" : "off"}.`);
  }
}
