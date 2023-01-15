import { ISetting } from "@shared/interfaces"
import Setting from "../../models/Setting";

export default class SettingHelper {
  public static async saveSetting(setting:ISetting) {
    const findSetting = await Setting.findOne({ where: { key: setting.key }});
    if(findSetting) await Setting.update({ ...setting }, { where: { key: setting.key }});
    else await Setting.create({ ...setting });
  }

  public static async getSetting(key: string): Promise<ISetting | null> {
    const findSetting = await Setting.findOne({ where: { key }, raw: true });
    if(findSetting) {
      return { key: findSetting.key, value: findSetting.value };
    }
    return null;
  }
}