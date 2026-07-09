import { describe, expect, it } from "vitest";
import { parseStreamFrame } from "./dealStream";

describe("deal stream parser", () => {
  it("parses server-sent event data frames", () => {
    expect(parseStreamFrame('data: {"id":"DL-10482","bid":99.77}\n\n')).toEqual({
      id: "DL-10482",
      bid: 99.77,
    });
  });

  it("parses newline-delimited json frames", () => {
    expect(parseStreamFrame('{"id":"DL-10534","spread":466}')).toEqual({
      id: "DL-10534",
      spread: 466,
    });
  });

  it("ignores empty heartbeat frames", () => {
    expect(parseStreamFrame(": keep-alive")).toBeNull();
  });
});
