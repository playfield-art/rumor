import { QLC } from "./lib/qlc/QLC";
import { openQLC } from "./lib/qlc/QLCHelpers";
import { QLCSingleton } from "./lib/qlc/QLCSingleton";
import SettingHelper from "./lib/settings/SettingHelper";

/**
 * Init QLC
 */
export const initQLC = async () => {
  // set localhost as default place for the QLC+ instance
  QLCSingleton.setInstance(new QLC("127.0.0.1", 7700));

  // open QLC+ at startup if needed
  if (Number((await SettingHelper.getSetting("qlcOpenAtStartup"))?.value)) {
    // get the file path
    const qlcFilePath = await SettingHelper.getSetting("qlcFile");

    // open QLC+
    openQLC(qlcFilePath?.value ?? "");
  }
};
