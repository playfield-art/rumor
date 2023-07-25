import { ISetting } from "@shared/interfaces";
import Setting from "../../models/Setting";

export default class SettingHelper {
  /**
   * Check if we can go to the next voiceover when voiceover is playing
   * @returns Boolean
   */
  public static async cannotGoToNextWhenVoiceOverIsPlaying(): Promise<boolean> {
    return Boolean(
      Number(
        (await SettingHelper.getSetting("cannotGoToNextWhenVoiceOverIsPlaying"))
          ?.value ?? "1"
      )
    );
  }

  /**
   * Get the slug of our booth from settings
   * @param defaultValue
   * @returns
   */
  public static async getBoothSlug(defaultValue = ""): Promise<string> {
    return (await SettingHelper.getSettingValue(
      "boothSlug",
      defaultValue
    )) as string;
  }

  /**
   * Get the current language from settings
   * @param defaultValue
   * @returns
   */
  public static async getLanguage(defaultValue = ""): Promise<string> {
    return (await SettingHelper.getSettingValue(
      "language",
      defaultValue
    )) as string;
  }

  /**
   * Get the Rumor CMS API url from settings
   * @param defaultValue
   * @returns
   */
  public static async getRumorCmsApiUrl(defaultValue = ""): Promise<string> {
    return (await SettingHelper.getSettingValue(
      "rumorCmsApiUrl",
      defaultValue
    )) as string;
  }

  /**
   * Get the Rumor CMS Token from settings
   * @param defaultValue
   * @returns
   */
  public static async getRumorCmsApiToken(defaultValue = ""): Promise<string> {
    return (await SettingHelper.getSettingValue(
      "rumorCmsApiToken",
      defaultValue
    )) as string;
  }

  /**
   * Get a setting
   * @param key The key of the setting
   * @returns The setting
   */
  public static async getSetting(key: string): Promise<ISetting | null> {
    const findSetting = await Setting.findOne({ where: { key }, raw: true });
    if (findSetting) {
      return { key: findSetting.key, value: findSetting.value };
    }
    return null;
  }

  /**
   * Get a setting value
   * @param key The key of the setting
   * @param defaultValue The default value of the setting
   * @returns
   */
  public static async getSettingValue(
    key: string,
    defaultValue: any
  ): Promise<any> {
    const setting = await SettingHelper.getSetting(key);
    if (!setting || !setting.value) {
      return defaultValue;
    }
    return setting.value;
  }

  /**
   * Save a setting
   * @param setting The setting to save
   */
  public static async saveSetting(setting: ISetting) {
    const findSetting = await Setting.findOne({ where: { key: setting.key } });
    if (findSetting)
      await Setting.update({ ...setting }, { where: { key: setting.key } });
    else await Setting.create({ ...setting });
  }

  /**
   * Sets a setting
   * @param key The key of the setting
   * @param value The value of the setting
   */
  public static async setSetting(key: string, value: any) {
    await SettingHelper.saveSetting({ key, value });
  }
}
