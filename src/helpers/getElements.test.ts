import { getElements } from "@src/helpers/getElements";

import { OFFICIAL_BODY } from "@tests/jest.constants";

describe("getElements.ts", () => {
  describe("General Tests.", () => {
    beforeEach(() => {
      document.body.innerHTML = OFFICIAL_BODY;
    });

    afterEach(() => {
      document.body.innerHTML = "";
    });

    test("It must render the elements of the document that the 'getElements' function exports.", () => {
      const {
        btnStart,
        btnsDifficulty,
        colorsBox,
        scoreElement,
        whoPlaysElement,
      } = getElements();

      expect(btnStart).toBeInTheDocument();
      expect(scoreElement).toBeInTheDocument();
      expect(whoPlaysElement).toBeInTheDocument();

      for (let btnDifficulty of btnsDifficulty) {
        expect(btnDifficulty).toBeInTheDocument();
      }

      for (let colorBox of colorsBox) {
        expect(colorBox).toBeInTheDocument();
      }
    });
  });
});
