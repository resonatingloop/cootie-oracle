export const CIPHER_IDS = ["aq", "ordinal", "qwer", "nqwer"] as const;

export type CipherId = (typeof CIPHER_IDS)[number];
export type CipherFamily = "alphanumeric" | "alphabetic";

export interface CipherDefinition {
  id: CipherId;
  label: string;
  pair: CipherId;
  family: CipherFamily;
  rule: string;
  mapping: ReadonlyMap<string, number>;
}

export interface CipherCalculation {
  cipher: CipherDefinition;
  value: number;
  mappedCharacters: number;
  ignoredCharacters: number;
}

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const qwerty = "qwertyuiopasdfghjklzxcvbnm";

function indexedMapping(characters: string, start: number): ReadonlyMap<string, number> {
  return new Map(Array.from(characters, (character, index) => [character, index + start]));
}

const aqMapping = indexedMapping(`0123456789${alphabet}`, 0);
const ordinalMapping = indexedMapping(alphabet, 1);
const qwerMapping = indexedMapping(qwerty, 1);
const nqwerMapping = indexedMapping(`1234567890${qwerty}`, 0);

export const CIPHERS: Readonly<Record<CipherId, CipherDefinition>> = {
  aq: {
    id: "aq",
    label: "AQ",
    pair: "nqwer",
    family: "alphanumeric",
    rule: "digits 0–9; a=10 through z=35",
    mapping: aqMapping,
  },
  ordinal: {
    id: "ordinal",
    label: "Ordinal",
    pair: "qwer",
    family: "alphabetic",
    rule: "a=1 through z=26",
    mapping: ordinalMapping,
  },
  qwer: {
    id: "qwer",
    label: "QWER",
    pair: "ordinal",
    family: "alphabetic",
    rule: "qwerty keyboard order; q=1 through m=26",
    mapping: qwerMapping,
  },
  nqwer: {
    id: "nqwer",
    label: "nQWER",
    pair: "aq",
    family: "alphanumeric",
    rule: "numeric qwerty order; 1=0 through m=35",
    mapping: nqwerMapping,
  },
};

export function calculateCipher(text: string, cipherId: CipherId): CipherCalculation {
  const cipher = CIPHERS[cipherId];
  let value = 0;
  let mappedCharacters = 0;
  let ignoredCharacters = 0;

  for (const character of text) {
    const mapped = cipher.mapping.get(character.toLowerCase());
    if (mapped === undefined) {
      ignoredCharacters += 1;
      continue;
    }

    mappedCharacters += 1;
    value += mapped;
  }

  return { cipher, value, mappedCharacters, ignoredCharacters };
}
