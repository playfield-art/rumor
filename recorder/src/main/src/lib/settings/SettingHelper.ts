import { ISetting } from "@shared/interfaces";
import Setting from "../../models/Setting";

export default class SettingHelper {
  public static async saveSetting(setting: ISetting) {
    const findSetting = await Setting.findOne({ where: { key: setting.key } });
    if (findSetting)
      await Setting.update({ ...setting }, { where: { key: setting.key } });
    else await Setting.create({ ...setting });
  }

  public static async getSetting(key: string): Promise<ISetting | null> {
    const findSetting = await Setting.findOne({ where: { key }, raw: true });
    if (findSetting) {
      return { key: findSetting.key, value: findSetting.value };
    }
    return null;
  }

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
   * Sets a setting
   * @param key The key of the setting
   * @param value The value of the setting
   */
  public static async setSetting(key: string, value: any) {
    await SettingHelper.saveSetting({ key, value });
  }
}
