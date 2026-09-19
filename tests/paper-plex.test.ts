import { describe, expect, it } from "vitest";
import { routeValue } from "../src/domain/paper-plex";

describe("paper-plex v1", () => {
  it("routes 888 to the founding specimen", () => {
    expect(routeValue(888)).toEqual({
      value: 888,
      address: 887,
      gate: 8,
      orbit: 110,
      arcanaIndex: 0,
      returnCount: 5,
      bearing: "reversed",
      passageLabel: "fifth return",
    });
  });

  it("covers one complete first passage", () => {
    expect(routeValue(1).gate).toBe(1);
    expect(routeValue(8).gate).toBe(8);
    expect(routeValue(9).arcanaIndex).toBe(1);
    expect(routeValue(176).arcanaIndex).toBe(21);
    expect(routeValue(177)).toMatchObject({
      gate: 1,
      arcanaIndex: 0,
      returnCount: 1,
      bearing: "reversed",
      passageLabel: "first return",
    });
  });

  it("rejects values that cannot have an address", () => {
    expect(() => routeValue(0)).toThrow(/positive safe integer/);
    expect(() => routeValue(-4)).toThrow(/positive safe integer/);
    expect(() => routeValue(1.5)).toThrow(/positive safe integer/);
  });

  it("keeps all eight gates and twenty-two arcana reachable", () => {
    const gates = new Set<number>();
    const arcana = new Set<number>();
    for (let value = 1; value <= 176; value += 1) {
      const route = routeValue(value);
      gates.add(route.gate);
      arcana.add(route.arcanaIndex);
    }
    expect(gates).toEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8]));
    expect(arcana.size).toBe(22);
  });
});
