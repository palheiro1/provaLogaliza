import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useState } from "react";
import seedrandom from "seedrandom";
import { Country } from "../domain/countries";
import { countriesI, CountryCode } from "../domain/countries.position";
import { Guess, loadAllGuesses, saveGuesses } from "../domain/guess";
import { areas, bigEnoughCountriesWithImage, countriesWithImage, smallCountryLimit } from './../environment';

const forcedCountries: Record<string, CountryCode> = {
  "2022-11-23": "TNA",
  "2022-11-24": "MAR",
  "2022-11-25": "BEZ",
  "2022-11-26": "ORT",
  "2022-11-27": "TTR",
  "2022-11-28": "BAM",
  "2022-11-29": "TAV",
  "2022-11-30": "CAL",
  "2022-12-01": "LIM",
  "2022-12-02": "BER",
  "2022-12-03": "MAS",
  "2022-12-04": "BAR",
  "2022-12-05": "TCA",
  "2022-12-06": "ORD",
  "2022-12-07": "DEC",
  "2022-12-08": "MON",
  "2022-12-09": "TMO",
  "2022-12-10": "BUR",
  "2022-12-11": "MUR",
  "2022-12-12": "TME",
  "2022-12-13": "VIA",
  "2022-12-14": "TLE",
  "2022-12-15": "CND",
  "2022-12-16": "LUG",
  "2022-12-17": "SAL",
  "2022-12-18": "PAR",
  "2022-12-19": "BAL",
  "2022-12-20": "MOR",
  "2022-12-21": "VDI",
  "2022-12-22": "SEA",
  "2022-12-23": "VIG",
  "2022-12-24": "TRA",
  "2022-12-25": "ANC",
  "2022-12-26": "CAB",
  "2022-12-27": "OUR",
  "2022-12-28": "EUM",
  "2022-12-29": "VDO",
  "2022-12-30": "TCH",
  "2022-12-31": "ULH",
  "2023-01-01": "RIB",
  "2023-01-02": "CHA",
  "2023-01-03": "ARN",
  "2023-01-04": "COR",
  "2023-01-05": "ARC",
  "2023-01-06": "CEL",
  "2023-01-07": "COS",
  "2023-01-08": "COU",
  "2023-01-09": "SAR",
  "2023-01-10": "COM",
  "2023-01-11": "PON",
  "2023-01-12": "CAR"
}

const noRepeatStartDate = DateTime.fromFormat("2022-05-01", "yyyy-MM-dd");

export function getDayString(shiftDayCount?: number) {
  return DateTime.now()
    .plus({ days: shiftDayCount ?? 0 })
    .toFormat("yyyy-MM-dd");
}

export function useTodays(dayString: string): [
  {
    country?: Country;
    guesses: Guess[];
  },
  (guess: Guess) => void,
  number,
  number
] {
  const [todays, setTodays] = useState<{
    country?: Country;
    guesses: Guess[];
  }>({ guesses: [] });

  const addGuess = useCallback(
    (newGuess: Guess) => {
      if (todays == null) {
        return;
      }

      const newGuesses = [...todays.guesses, newGuess];

      setTodays((prev) => ({ country: prev.country, guesses: newGuesses }));
      saveGuesses(dayString, newGuesses);
    },
    [dayString, todays]
  );

  useEffect(() => {
    const guesses = loadAllGuesses()[dayString] ?? [];
    const country = getCountry(dayString);

    setTodays({ country, guesses });
  }, [dayString]);

  const randomAngle = useMemo(
    () => seedrandom.alea(dayString)() * 360,
    [dayString]
  );

  const imageScale = useMemo(() => {
    const normalizedAngle = 45 - (randomAngle % 90);
    const radianAngle = (normalizedAngle * Math.PI) / 180;
    return 1 / (Math.cos(radianAngle) * Math.sqrt(2));
  }, [randomAngle]);

  return [todays, addGuess, randomAngle, imageScale];
}

function getCountry(dayString: string) {
  const currentDayDate = DateTime.fromFormat(dayString, "yyyy-MM-dd");
  let pickingDate = DateTime.fromFormat("2022-03-21", "yyyy-MM-dd");
  let smallCountryCooldown = 0;
  let pickedCountry: Country | null = null;

  const lastPickDates: Record<string, DateTime> = {};

  do {
    smallCountryCooldown--;

    const pickingDateString = pickingDate.toFormat("yyyy-MM-dd");

    const forcedCountryCode = forcedCountries[dayString];

    const forcedCountry =
      forcedCountryCode != null
        ? countriesWithImage.find(
          (country: countriesI) => country.code === forcedCountryCode
        )
        : undefined;

    const countrySelection =
      smallCountryCooldown < 0
        ? countriesWithImage
        : bigEnoughCountriesWithImage;

    if (forcedCountry != null) {
      pickedCountry = forcedCountry;
    } else {
      let countryIndex = Math.floor(
        seedrandom.alea(pickingDateString)() * countrySelection.length
      );
      pickedCountry = countrySelection[countryIndex];

      if (pickingDate >= noRepeatStartDate) {
        while (isARepeat(pickedCountry, lastPickDates, pickingDate)) {
          countryIndex = (countryIndex + 1) % countrySelection.length;
          pickedCountry = countrySelection[countryIndex];
        }
      }
    }

    if (areas[pickedCountry!.code] < smallCountryLimit) {
      smallCountryCooldown = 7;
    }


    lastPickDates[pickedCountry!.code] = pickingDate;
    pickingDate = pickingDate.plus({ day: 1 });
  } while (pickingDate <= currentDayDate);

  return pickedCountry!;
}

function isARepeat(
  pickedCountry: Country | null,
  lastPickDates: Record<string, DateTime>,
  pickingDate: DateTime
) {
  if (pickedCountry == null || lastPickDates[pickedCountry.code] == null) {
    return false;
  }
  const daysSinceLastPick = pickingDate.diff(
    lastPickDates[pickedCountry.code],
    "day"
  ).days;

  return daysSinceLastPick < 100;
}
