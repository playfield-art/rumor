import { ChapterOption, ISetting } from "@shared/interfaces";
import Setting from "../../models/Setting";
import { narrativeChapters } from "../../consts";

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
   * Get the selected chapter options from settings by part/chapter
   * @param part The part/chapter
   * @returns An id representing the selected chapter option
   */
  public static async getSelectedChapterOptionId(
    chapter: string
  ): Promise<string> {
    // get the selected chapter option
    const selectedChapterOptions =
      await SettingHelper.getSelectedChapterOptions();

    // if there are no selected chapter options, return null
    if (
      !selectedChapterOptions ||
      !selectedChapterOptions.find((x) => x.chapter === chapter.toLowerCase())
    )
      return "random";

    // find the chapter corresponding to the incoming part
    const findChapter = selectedChapterOptions.find(
      (x: any) => x.chapter === chapter.toLowerCase()
    );

    // if there is no part, return random
    if (!findChapter) return "random";

    // return the option
    return findChapter.optionId;
  }

  /**
   * Get the slected chapter options from settings
   * @returns The selected chapter options
   */
  public static async getSelectedChapterOptions(): Promise<ChapterOption[]> {
    // get the selected chapter options
    const selectedChapterOptions = await SettingHelper.getSetting(
      "selectedChapterOptions"
    );

    // if there are no selected chapter options, return null
    if (!selectedChapterOptions || !selectedChapterOptions.value)
      return narrativeChapters.map((chapter) => ({
        chapter,
        optionId: "random",
      }));

    // parse the selected chapter options
    const parsedSelectedChapterOptions = JSON.parse(
      selectedChapterOptions.value
    );

    // return the selected chapter options
    return parsedSelectedChapterOptions;
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

  /**
   * Sets the selected chapter option
   */
  public static async setSelectedChapterOption(
    chapterOption: ChapterOption
  ): Promise<void> {
    // first get the current chapter options
    const selectedChapterOptions = await SettingHelper.getSetting(
      "selectedChapterOptions"
    );

    // if there are no selected chapter options, create a new one
    if (!selectedChapterOptions || !selectedChapterOptions.value) {
      // create an array of objects based upon the narrative parts
      const newSelectedChapterOptions = narrativeChapters.map((c) => ({
        chapter: c,
        option: "random",
      }));

      await SettingHelper.saveSetting({
        key: "selectedChapterOptions",
        value: JSON.stringify(newSelectedChapterOptions),
      });

      // retry this function
      return this.setSelectedChapterOption(chapterOption);
    }

    // parse the selected chapter options
    const parsedSelectedChapterOptions: ChapterOption[] = JSON.parse(
      selectedChapterOptions.value
    ) as ChapterOption[];

    // find the chapter corresponding to the incoming part
    const findChapterOption = parsedSelectedChapterOptions.find(
      (co: ChapterOption) => co.chapter === chapterOption.chapter.toLowerCase()
    );

    // if there is no part, return
    if (!findChapterOption) throw new Error("Chapter not found");

    // change the option
    findChapterOption.optionId = chapterOption.optionId;

    // save the setting
    return SettingHelper.saveSetting({
      key: "selectedChapterOptions",
      value: JSON.stringify(parsedSelectedChapterOptions),
    });
  }
}
