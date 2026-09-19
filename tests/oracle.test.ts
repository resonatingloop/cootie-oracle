import { describe, expect, it } from "vitest";
import { FIELD_01 } from "../src/content/field-01";
import {
  consultOracle,
  formatReceipt,
  UnmappableOfferingError,
  ZeroValueOfferingError,
} from "../src/domain/oracle";

describe("field oracle", () => {
  it("is deterministic for a phrase, cipher, and edition", () => {
    const first = consultOracle("cootie oracle", "aq", FIELD_01);
    const second = consultOracle("cootie oracle", "aq", FIELD_01);
    expect(second).toEqual(first);
    expect(first.calculation.value).toBe(229);
  });

  it("binds the gate to its authored fortune", () => {
    const reading = consultOracle("A", "ordinal", FIELD_01);
    expect(reading.route.gate).toBe(1);
    expect(reading.fortune).toBe(FIELD_01.fortunes[0]);
    expect(formatReceipt(reading)).toContain("0 · the fool");
  });

  it("refuses unmapped and zero-valued offerings honestly", () => {
    expect(() => consultOracle("☤🗧", "ordinal", FIELD_01)).toThrow(
      UnmappableOfferingError,
    );
    expect(() => consultOracle("0", "aq", FIELD_01)).toThrow(ZeroValueOfferingError);
  });
});
