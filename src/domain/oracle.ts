import type { OracleEdition } from "../content/field-01";
import { calculateCipher, type CipherCalculation, type CipherId } from "./ciphers";
import { routeValue, type PaperPlexRoute } from "./paper-plex";
import { getArcana, type Arcana } from "./tarot";

export interface OracleReading {
  offering: string;
  edition: Pick<OracleEdition, "id" | "name">;
  calculation: CipherCalculation;
  route: PaperPlexRoute;
  arcana: Arcana;
  fortune: string;
}

export class UnmappableOfferingError extends Error {
  constructor() {
    super("the offering contains no characters mapped by this cipher");
    this.name = "UnmappableOfferingError";
  }
}

export class ZeroValueOfferingError extends Error {
  constructor() {
    super("zero has no hinge; the offering needs a positive value");
    this.name = "ZeroValueOfferingError";
  }
}

export function consultOracle(
  offering: string,
  cipherId: CipherId,
  edition: OracleEdition,
): OracleReading {
  const calculation = calculateCipher(offering, cipherId);
  if (calculation.mappedCharacters === 0) throw new UnmappableOfferingError();
  if (calculation.value === 0) throw new ZeroValueOfferingError();

  const route = routeValue(calculation.value);
  const fortune = edition.fortunes[route.gate - 1];
  if (!fortune) {
    throw new RangeError(`edition ${edition.id} does not define gate ${route.gate}`);
  }

  return {
    offering: offering.trim().replace(/\s+/g, " "),
    edition: { id: edition.id, name: edition.name },
    calculation,
    route,
    arcana: getArcana(route.arcanaIndex),
    fortune,
  };
}

export function formatReceipt(reading: OracleReading): string {
  const { calculation, route, arcana } = reading;
  return [
    `regarding: ${reading.offering}`,
    `${calculation.cipher.label}: ${calculation.value}`,
    "",
    `gate ${route.gate}`,
    `${arcana.numeral} · ${arcana.name}`,
    `${route.passageLabel} · ${route.bearing}`,
    "",
    reading.fortune,
    "",
    `${reading.edition.id} · cootie-oracle`,
  ].join("\n");
}
