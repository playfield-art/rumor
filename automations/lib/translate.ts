import googleCloudTranslate from "@google-cloud/translate";

export class GoogleTranslate {
  private _translate;

  constructor(key: string, projectId: string) {
    const { Translate } = googleCloudTranslate.v2;
    // instantiates a client
    this._translate = new Translate({
      key,
      projectId,
    });
  }

  async translate(message: string, targetLanguage: string) {
    const [translation] = await this._translate.translate(
      message,
      targetLanguage || "en"
    );
    return translation;
  }
}
