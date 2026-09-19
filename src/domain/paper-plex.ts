export type Bearing = "upright" | "reversed";

export interface PaperPlexRoute {
  value: number;
  address: number;
  gate: number;
  orbit: number;
  arcanaIndex: number;
  returnCount: number;
  bearing: Bearing;
  passageLabel: string;
}

const ordinalNames = [
  "zeroth",
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
  "tenth",
  "eleventh",
  "twelfth",
] as const;

function ordinalWord(value: number): string {
  const known = ordinalNames[value];
  if (known) return known;

  const finalTwo = value % 100;
  const finalOne = value % 10;
  const suffix =
    finalTwo >= 11 && finalTwo <= 13
      ? "th"
      : finalOne === 1
        ? "st"
        : finalOne === 2
          ? "nd"
          : finalOne === 3
            ? "rd"
            : "th";
  return `${value}${suffix}`;
}

export function routeValue(value: number): PaperPlexRoute {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new RangeError(`paper-plex requires a positive safe integer; received ${value}`);
  }

  const address = value - 1;
  const gate = (address % 8) + 1;
  const orbit = Math.floor(address / 8);
  const arcanaIndex = orbit % 22;
  const returnCount = Math.floor(orbit / 22);
  const bearing: Bearing = returnCount % 2 === 0 ? "upright" : "reversed";
  const passageLabel =
    returnCount === 0 ? "first passage" : `${ordinalWord(returnCount)} return`;

  return {
    value,
    address,
    gate,
    orbit,
    arcanaIndex,
    returnCount,
    bearing,
    passageLabel,
  };
}
