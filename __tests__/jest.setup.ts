import "@testing-library/jest-dom";

import { mockAssets } from "@tests/__mocks__/assets.mock";
import { mockModes } from "@tests/__mocks__/modes.mock";

jest.mock("@/assets/export", () => ({
  __esModule: true,
  default: mockAssets,
}));

jest.mock("@/constants/modes", () => ({
  __esModule: true,
  default: mockModes,
}));
