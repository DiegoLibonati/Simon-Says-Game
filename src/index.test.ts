import { screen } from "@testing-library/dom";

import { OFFICIAL_BODY } from "./tests/jest.constants";

describe("index.ts", () => {
  describe("General Tests.", () => {
    beforeEach(() => {
      document.body.innerHTML = OFFICIAL_BODY;

      require("./index.ts");
      document.dispatchEvent(new Event("DOMContentLoaded"));
    });

    afterEach(() => {
      document.body.innerHTML = "";
    });

    test("It must render the title, game description, and score.", () => {
      const title = screen.getByRole("heading", { name: /¿how to play?/i });
      const description = screen.getByText(
        "Press the start button to start playing. First the machine will play, wait for it to say 'Now the user plays' to play, don't be in a hurry. Repeat the sequence of colors, continue until the computer explodes or you lose, surely you lose. (If you want to change difficulty of the game you need tou lose first). Good Luck."
      );
      const whoPlays = screen.getByRole("heading", { name: /press start/i });
      const score = screen.getByRole("heading", { name: /score: 0/i });

      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(whoPlays).toBeInTheDocument();
      expect(score).toBeInTheDocument();
    });

    test("It must render the 'Start', 'Easy', 'Medium' and 'Hard' buttons.", () => {
      const btnStart = screen.getByRole("button", { name: /start/i });
      const btnEasy = screen.getByRole("button", { name: /easy mode/i });
      const btnMedium = screen.getByRole("button", { name: /medium mode/i });
      const btnHard = screen.getByRole("button", { name: /hard mode/i });

      expect(btnStart).toBeInTheDocument();
      expect(btnEasy).toBeInTheDocument();
      expect(btnMedium).toBeInTheDocument();
      expect(btnHard).toBeInTheDocument();
    });

    test("It must render the game board with all 4 colors.", () => {
      const tableTop = document.querySelector(".game__board");
      const greenColor = document.getElementById("green");
      const redColor = document.getElementById("red");
      const yellowColor = document.getElementById("yellow");
      const blueColor = document.getElementById("blue");

      expect(tableTop).toBeInTheDocument();
      expect(greenColor).toBeInTheDocument();
      expect(redColor).toBeInTheDocument();
      expect(yellowColor).toBeInTheDocument();
      expect(blueColor).toBeInTheDocument();
    });
  });
});
