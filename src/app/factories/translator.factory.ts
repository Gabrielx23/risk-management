import { Language } from '../../shared/enum/language.enum';
import { Translator } from '../../shared/translator';

const PARAM_ANCHOR = '::';

export const createTranslator =
  (translations: Record<Language, Record<string, string>>): Translator =>
  (
    language: Language,
    phrase: string,
    params: Record<string, string> = {},
    paramAnchor = PARAM_ANCHOR
  ): string => {
    const languageTranslations = translations[language];
    let translation = languageTranslations[phrase] ?? phrase;
    for (const param in params) {
      translation = translation
        .split(`${paramAnchor}${param}`)
        .join(params[param]);
    }

    return translation;
  };
