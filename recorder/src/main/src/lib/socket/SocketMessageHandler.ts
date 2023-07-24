/**
 * This class is used to handle the messages coming from the socket
 */

import { SocketMessage } from "@shared/interfaces";
import SettingHelper from "../settings/SettingHelper";
import { startSession, stopSession } from "../../controllers/audio";
import SoundBoard from "../audio/SoundBoard";
import { SocketSingleton } from "./SocketSingleton";
import { MqttSingleton } from "../mqtt/MqttSingleton";

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
  public static handleMessageSetLanguage(json: any) {
    SettingHelper.saveSetting({ key: "language", value: json.language });
  }

  /**
   * Handle start session
   * @param json
   */
  public static handleMessageStartSession() {
    if (!SoundBoard.sessionRunning) {
      startSession();
    }
    SocketSingleton.getInstance().sendToClients(
      "change-page",
      "during-performance"
    );
  }

  /**
   * Handle stop session
   * @param json
   */
  public static handleMessageStopSession() {
    if (SoundBoard.sessionRunning) {
      stopSession();
    }
    SocketSingleton.getInstance().sendToClients("change-page", "set-language");
  }

  /**
   * Handle screen
   * @param json
   */
  public static handleMessageScreen(json: any) {
    MqttSingleton.getInstance().publish("interface/screen", {
      state: json.state ? 1 : 0,
    });
  }
}
