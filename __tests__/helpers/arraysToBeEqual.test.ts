import { arraysToBeEqual } from "@/helpers/arraysToBeEqual";

describe("arraysToBeEqual", () => {
  describe("when arrays are equal", () => {
    it("should return true for identical arrays", () => {
      expect(arraysToBeEqual(["green", "red"], ["green", "red"])).toBe(true);
    });

    it("should return true for single-element equal arrays", () => {
      expect(arraysToBeEqual(["blue"], ["blue"])).toBe(true);
    });

    it("should return true for multi-element equal arrays", () => {
      expect(
        arraysToBeEqual(
          ["green", "yellow", "red", "blue"],
          ["green", "yellow", "red", "blue"]
        )
      ).toBe(true);
    });
  });

  describe("when arrays are not equal", () => {
    it("should return false when last element differs", () => {
      expect(arraysToBeEqual(["green", "red"], ["green", "blue"])).toBe(false);
    });

    it("should return false when order differs", () => {
      expect(arraysToBeEqual(["green", "red"], ["red", "green"])).toBe(false);
    });

    it("should return false when first array is longer", () => {
      expect(arraysToBeEqual(["green", "red"], ["green"])).toBe(false);
    });

    it("should return false when second array is longer", () => {
      expect(arraysToBeEqual(["green"], ["green", "red"])).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should return false for two empty arrays", () => {
      expect(arraysToBeEqual([], [])).toBe(false);
    });

    it("should return false when first array is empty", () => {
      expect(arraysToBeEqual([], ["green"])).toBe(false);
    });

    it("should return false when second array is empty", () => {
      expect(arraysToBeEqual(["green"], [])).toBe(false);
    });
  });
});
