export interface Arcana {
  index: number;
  numeral: string;
  name: string;
}

const names = [
  "the fool",
  "the magus",
  "the priestess",
  "the empress",
  "the emperor",
  "the hierophant",
  "the lovers",
  "the chariot",
  "adjustment",
  "the hermit",
  "fortune",
  "lust",
  "the hanged man",
  "death",
  "art",
  "the devil",
  "the tower",
  "the star",
  "the moon",
  "the sun",
  "the aeon",
  "the universe",
] as const;

const numerals = [
  "0",
  "i",
  "ii",
  "iii",
  "iv",
  "v",
  "vi",
  "vii",
  "viii",
  "ix",
  "x",
  "xi",
  "xii",
  "xiii",
  "xiv",
  "xv",
  "xvi",
  "xvii",
  "xviii",
  "xix",
  "xx",
  "xxi",
] as const;

export const MAJOR_ARCANA: readonly Arcana[] = names.map((name, index) => ({
  index,
  numeral: numerals[index] ?? String(index),
  name,
}));

export function getArcana(index: number): Arcana {
  const card = MAJOR_ARCANA[index];
  if (!card) {
    throw new RangeError(`arcana index must be between 0 and 21; received ${index}`);
  }
  return card;
}
