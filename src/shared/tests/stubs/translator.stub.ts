import { Language } from '../../enum/language.enum';
import { Translator } from '../../translator';

export const translatorPhraseStub = 'translated phrase';

export const translatorStub =
  (phraseToBeReturned = translatorPhraseStub): Translator =>
  (language: Language, phrase: string, params?: Record<string, string>) =>
    translatorPhraseStub;
