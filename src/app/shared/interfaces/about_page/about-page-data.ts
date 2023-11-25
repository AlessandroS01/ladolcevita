export interface AboutPageLangData {
  title: string,
  title_description: string,
  subtitles: {
    description: string;
    value: string;
  }[],
}

export interface AboutPageData {
  en: AboutPageLangData,
  it: AboutPageLangData,
  ko: AboutPageLangData,
}


