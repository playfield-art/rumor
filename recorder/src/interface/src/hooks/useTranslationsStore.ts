import { create } from 'zustand'
import { interfaceTranslations } from '../translations';


type TranslationsState = {
  translations: any;
};

type TranslationsAction = {
  changeTranslations: (languageCode: string) => void;
};

export const useTranslationsStore = create<TranslationsState & TranslationsAction>((set) => ({
  translations: interfaceTranslations.en,
  changeTranslations: (languageCode: string) => set(
    (state: any) => ({
      translations: interfaceTranslations[languageCode as keyof typeof interfaceTranslations]
    })),
}))