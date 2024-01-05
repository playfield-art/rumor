import OpenAI from "openai";
import { systemInstructs } from "../src/consts";

export class RumorOpenAI {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey,
    });
  }

  getModerationPrompt(
    language: string = "nl",
    categories: string[],
    question: string,
    answer: string
  ) {
    if (language === "nl") {
      return `
        Ik heb een enquête afgenomen en ik vroeg in de ${
          categories.length > 0 ? "categorieën" : "categorie"
        } ${categories.join(",")} iemand volgende vraag: "${question}".
        Het originele antwoord op deze vraag was: "${answer}".
        Kan je het antwoord op de vraag herformuleren zodat de context van de vraag duidelijk wordt in het antwoord. Behoud de lengte van het originele antwoord en verzin GEEN extra tekst, hou je zoveel mogelijk aan het originele antwoord.
      `;
    }

    return "";
  }

  getSystemInstruct(language: "nl" | "en"): string {
    return systemInstructs[language];
  }

  async generateText(system: string, prompt: string): Promise<string> {
    // const completion = await this.openai.
    const completion = await this.openai.chat.completions.create({
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      model: "gpt-4-1106-preview",
    });
    return completion.choices[0].message.content?.toString() || "";
  }

  async moderate(
    language: "nl" | "en",
    categories: string[],
    question: string,
    answer: string
  ): Promise<string> {
    if (!answer) return "";
    const systemInstruct = this.getSystemInstruct(language);
    const moderationPrompt = this.getModerationPrompt(
      language,
      categories,
      question,
      answer
    );
    return this.generateText(systemInstruct, moderationPrompt);
  }
}
