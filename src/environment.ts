import { worldAreas } from './domain/countries.area';
import { areasComarcas } from './domain/comarcas.area';
import { galicianComarcas } from './domain/comarcas.position';
import { countriesI, worldCountries } from './domain/countries.position';
import { galicianCountryNames } from './domain/comarcas.name.co';
import { corsicanCountryNames } from './domain/countries.name.co';
import { countryCodesWithImage } from './domain/countries.image';
import { comarcasCodesWithImage } from './domain/comarcas.image.ts';

export const WORLDLE = "WORLDLE";
export const GALIZARIO = "GALIZARIO";

export const environment = false;

export const smallCountryLimit = 5000;

export const worldCountriesWithImage = worldCountries.filter((c) =>
  countryCodesWithImage.includes(c.code.toLowerCase())
);

export const comarcasWithImage = galicianComarcas.filter((c) =>
  comarcasCodesWithImage.includes(c.code.toLowerCase())
);

export const bigEnoughWorldCountriesWithImage = worldCountriesWithImage.filter(
  (country) => worldAreas[country.code] > smallCountryLimit
);

export const bigEnoughComarcasWithImage = comarcasWithImage.filter(
  (country) => areasComarcas[country.code] > smallCountryLimit
);

export const countries: countriesI[] = environment ? worldCountries : galicianComarcas;
export const areas: Record<string, number> = environment ? worldAreas : areasComarcas;
export const srcImageFolder: string = environment ? `countries` : `comarcas`;
export const srcImageFilename: string = environment ? `vector.svg` : `mapa.png`;
export const languages: Record<string, string> = environment ? corsicanCountryNames : galicianCountryNames;
export const countriesWithImage = environment ? worldCountriesWithImage : comarcasWithImage;
export const bigEnoughCountriesWithImage = environment ? bigEnoughWorldCountriesWithImage : bigEnoughComarcasWithImage;
