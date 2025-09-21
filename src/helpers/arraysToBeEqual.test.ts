import { arraysToBeEqual } from "@src/helpers/arraysToBeEqual";

describe("arraysToBeEqual.ts", () => {
  describe("General Tests.", () => {
    test("It should return 'False' since the arrays are not equal.", () => {
      const testOne = arraysToBeEqual(["3"], ["2"]);
      const testTwo = arraysToBeEqual(["2"], ["3"]);
      const testThree = arraysToBeEqual(["2", "4"], ["3"]);
      const testFour = arraysToBeEqual(["3"], ["2", "4"]);
      const testFive = arraysToBeEqual(["2", "4"], ["4", "2"]);
      const testSix = arraysToBeEqual([], ["5", "2"]);
      const testSeven = arraysToBeEqual(["5", "2"], []);

      expect(testOne).toBeFalsy();
      expect(testTwo).toBeFalsy();
      expect(testThree).toBeFalsy();
      expect(testFour).toBeFalsy();
      expect(testFive).toBeFalsy();
      expect(testSix).toBeFalsy();
      expect(testSeven).toBeFalsy();
    });

    test("It should return 'True' since the arrays are the same.", () => {
      const testOne = arraysToBeEqual(["2"], ["2"]);
      const testTwo = arraysToBeEqual(["2", "3"], ["2", "3"]);

      expect(testOne).toBeTruthy();
      expect(testTwo).toBeTruthy();
    });
  });
});
