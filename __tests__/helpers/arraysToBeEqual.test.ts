import { arraysToBeEqual } from "@/helpers/arraysToBeEqual";

describe("arraysToBeEqual", () => {
  it("should return true for equal arrays", () => {
    const arr1 = ["red", "blue", "green"];
    const arr2 = ["red", "blue", "green"];

    expect(arraysToBeEqual(arr1, arr2)).toBe(true);
  });

  it("should return false for arrays with different lengths", () => {
    const arr1 = ["red", "blue"];
    const arr2 = ["red", "blue", "green"];

    expect(arraysToBeEqual(arr1, arr2)).toBe(false);
  });

  it("should return false for arrays with different elements", () => {
    const arr1 = ["red", "blue", "green"];
    const arr2 = ["red", "yellow", "green"];

    expect(arraysToBeEqual(arr1, arr2)).toBe(false);
  });

  it("should return false for arrays with same elements in different order", () => {
    const arr1 = ["red", "blue", "green"];
    const arr2 = ["blue", "red", "green"];

    expect(arraysToBeEqual(arr1, arr2)).toBe(false);
  });

  it("should return false for empty arrays", () => {
    const arr1: string[] = [];
    const arr2: string[] = [];

    expect(arraysToBeEqual(arr1, arr2)).toBe(false);
  });

  it("should return false when one array is empty", () => {
    const arr1 = ["red"];
    const arr2: string[] = [];

    expect(arraysToBeEqual(arr1, arr2)).toBe(false);
  });

  it("should return true for single element equal arrays", () => {
    const arr1 = ["red"];
    const arr2 = ["red"];

    expect(arraysToBeEqual(arr1, arr2)).toBe(true);
  });

  it("should return false for single element different arrays", () => {
    const arr1 = ["red"];
    const arr2 = ["blue"];

    expect(arraysToBeEqual(arr1, arr2)).toBe(false);
  });
});
