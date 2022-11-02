// Source:
// Countries with long/lat => https://developers.google.com/public-data/docs/canonical/countries_csv
// Countries images => https://github.com/djaiss/mapsicon
// Country area => https://github.com/samayo/country-json/blob/master/src/country-by-surface-area.json

import { languages } from "../environment";

export interface Country {
  code: string;
  latitude: number;
  longitude: number;
  name: string;
}


export function getCountryName(language: string, country: Country) {
  return languages[country.code];
}

export function sanitizeCountryName(countryName: string): string {
  return countryName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[- '()]/g, "")
    .toLowerCase();
}
