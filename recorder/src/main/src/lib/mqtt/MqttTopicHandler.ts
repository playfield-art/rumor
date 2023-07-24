/**
 * This class is used to handle the mqtt topics
 */

import { QLCFunction } from "@shared/enums";
import { startSession, stopSession } from "../../controllers/audio";
import SoundBoard from "../audio/SoundBoard";
import { Exception } from "../exceptions/Exception";
import { QLCSingleton } from "../qlc/QLCSingleton";
import SettingHelper from "../settings/SettingHelper";
import { doorStateChanged } from "../../controllers/door";
import { SocketSingleton } from "../socket/SocketSingleton";

export class MqttTopicHandler {
  /**
   * Handle incoming mqtt topics
   * @param topic The topic
   * @param message The message
   */
  public static async handleTopic(topic: string, message: string = "") {
    // convert the message to a json object
    const json = JSON.parse(message.toString());

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
      await MqttTopicHandler[methodName as keyof typeof MqttTopicHandler](json);
    }
  }

  /**
   * Handle the INTERFACE topics
   */

  public static async handleTopicInterfaceButton(json: any) {
    try {
      if (json.button) {
        SocketSingleton.getInstance().sendToClients("button-pressed", {
          button: json.button,
        });
      }
    } catch (e: any) {
      throw new Exception({
        where: "handleTopicInterfaceButton",
        message: e.message,
      });
    }
  }

  /**
   * Handle the LIGHT topics
   */

  /**
   * Sets the color of the light
   * @param json
   */
  public static async handleTopicLightFunction(json: {
    function: QLCFunction;
  }) {
    try {
      QLCSingleton.getInstance().triggerFunction(json.function);
    } catch (e: any) {
      throw new Exception({
        where: "handleTopicLightFunction",
        message: e.message,
      });
    }
  }

  /**
   * Sets the color of the light
   * @param json
   */
  public static async handleTopicLightSetColor(json: {
    color: "red" | "green" | "blue" | "white";
    value: number;
  }) {
    try {
      const colorToChannelMap = {
        red: 1,
        green: 2,
        blue: 3,
        white: 4,
      };
      if (
        json.color &&
        json.value &&
        json.value >= 0 &&
        json.value <= 255 &&
        Object.keys(colorToChannelMap).includes(json.color)
      ) {
        QLCSingleton.getInstance().setChannel(
          colorToChannelMap[json.color],
          json.value
        );
      }
    } catch (e: any) {
      throw new Exception({
        where: "handleTopicLightSetColor",
        message: e.message,
      });
    }
  }

  /**
   * Handle the RECORDER topics
   */

  /**
   * Handle the topic recorder/nextVoiceOver
   * @param json
   */
  public static async handleTopicRecorderNextVoiceOver() {
    try {
      SoundBoard.next();
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

  /**
   * Handle the topic recorder/startSession
   */
  public static async handleTopicRecorderStartSession() {
    try {
      await startSession();
    } catch (e: any) {
      throw new Exception({
        where: "handleTopicRecorderStartSession",
        message: e.message,
      });
    }
  }

  /**
   * Handle the topic recorder/stopSession
   */
  public static async handleTopicRecorderStopSession() {
    try {
      await stopSession();
    } catch (e: any) {
      throw new Exception({
        where: "handleTopicRecorderStopSession",
        message: e.message,
      });
    }
  }

  /**
   * Handle the rumor door sate
   * @param json
   */
  public static async handleTopicShelliesRumordoorInfo(json: any) {
    if (json.sensor && json.sensor.state && json.bat) {
      doorStateChanged({
        open: json.sensor.state === "open",
        battery: json.bat.value,
      });
    }
  }
}
