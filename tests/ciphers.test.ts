import { describe, expect, it } from "vitest";
import { calculateCipher, CIPHERS } from "../src/domain/ciphers";

describe("cipher authority", () => {
  it("matches the canonical aq vectors", () => {
    expect(calculateCipher("UNITY", "aq").value).toBe(134);
    expect(calculateCipher("TRUE", "aq").value).toBe(100);
    expect(calculateCipher("ZERO", "aq").value).toBe(100);
    expect(calculateCipher("A! B", "aq").value).toBe(21);
  });

  it("matches the canonical ordinal vectors", () => {
    expect(calculateCipher("CAT", "ordinal").value).toBe(24);
    expect(calculateCipher("cat!", "ordinal").value).toBe(24);
  });

  it("matches the canonical qwer positions", () => {
    expect(calculateCipher("Q", "qwer").value).toBe(1);
    expect(calculateCipher("W", "qwer").value).toBe(2);
    expect(calculateCipher("E", "qwer").value).toBe(3);
    expect(calculateCipher("A", "qwer").value).toBe(11);
    expect(calculateCipher("Z", "qwer").value).toBe(20);
    expect(calculateCipher("M", "qwer").value).toBe(26);
  });

  it("matches the canonical nqwer positions", () => {
    expect(calculateCipher("1", "nqwer").value).toBe(0);
    expect(calculateCipher("0", "nqwer").value).toBe(9);
    expect(calculateCipher("Q", "nqwer").value).toBe(10);
    expect(calculateCipher("W", "nqwer").value).toBe(11);
    expect(calculateCipher("M", "nqwer").value).toBe(35);
    expect(calculateCipher("AQ", "nqwer").value).toBe(30);
  });

  it("keeps the matched pairs distinct", () => {
    expect(CIPHERS.aq.pair).toBe("nqwer");
    expect(CIPHERS.nqwer.pair).toBe("aq");
    expect(CIPHERS.ordinal.pair).toBe("qwer");
    expect(CIPHERS.qwer.pair).toBe("ordinal");
    expect(calculateCipher("cootie oracle", "aq").value).not.toBe(
      calculateCipher("cootie oracle", "nqwer").value,
    );
  });
});
