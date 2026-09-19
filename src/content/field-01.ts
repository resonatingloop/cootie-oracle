import type { CipherId } from "../domain/ciphers";

export interface OracleEdition {
  id: string;
  name: string;
  subtitle: string;
  cipherIds: readonly CipherId[];
  fortunes: readonly string[];
}

export const FIELD_01: OracleEdition = {
  id: "field-01",
  name: "field oracle no. 01",
  subtitle: "eight allegations for a paper machine",
  cipherIds: ["aq", "ordinal", "qwer", "nqwer"],
  fortunes: [
    "you will inherit a key and spend eleven years discovering what it refuses to open.",
    "someone with your exact number is already telling this story backward.",
    "you will become briefly famous among seven people.",
    "your next great romance owns an upsetting amount of glassware.",
    "you will escape the labyrinth and immediately miss its amenities.",
    "a minor administrative error will reveal your true vocation.",
    "you get everything you asked for, but in the wrong font.",
    "you will live in a mansion with four children and a minivan. one of these is metaphorical. it is not the minivan.",
  ],
};
