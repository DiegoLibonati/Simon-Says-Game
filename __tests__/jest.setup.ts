import "@testing-library/jest-dom";

import { mockModes } from "@tests/__mocks__/modes.mock";

jest.mock("@/constants/modes", () => ({
  __esModule: true,
  default: mockModes,
}));
