import { Language } from './enum/language.enum';

export type Translator = (
  language: Language,
  phrase: string,
  params?: Record<string, string>
) => string;
