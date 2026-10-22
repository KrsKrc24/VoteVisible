export type LanguageCode =
  | "en"
  | "es"
  | "ar"
  | "hi"
  | "te"
  | "zh-CN"
  | "vi"
  | "ko"
  | "tl"
  | "ru";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "te", label: "Telugu", nativeLabel: "తెలుగు" },
  { code: "zh-CN", label: "Chinese", nativeLabel: "中文" },
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt" },
  { code: "ko", label: "Korean", nativeLabel: "한국어" },
  { code: "tl", label: "Tagalog", nativeLabel: "Tagalog" },
  { code: "ru", label: "Russian", nativeLabel: "Русский" },
];
