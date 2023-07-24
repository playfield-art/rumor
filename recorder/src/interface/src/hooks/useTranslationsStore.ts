import { create } from 'zustand'
import translationsInSetup from '../translations';


type TranslationsState = {
  translations: any;
};

type TranslationsAction = {
  changeTranslations: (languageCode: string) => void;
};

export const useTranslationsStore = create<TranslationsState & TranslationsAction>((set) => ({
  translations: translationsInSetup.en,
  changeTranslations: (languageCode: string) => set(
    (state: any) => ({
      translations: translationsInSetup[languageCode as keyof typeof translationsInSetup]
    })),
}))