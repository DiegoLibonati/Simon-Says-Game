import type { Mode } from "@/types/app";

const modes: Mode[] = [
  { id: "easy", name: "easy", timeColorDelay: 1000, timeColorChange: 500 },
  { id: "medium", name: "medium", timeColorDelay: 500, timeColorChange: 250 },
  { id: "hard", name: "hard", timeColorDelay: 250, timeColorChange: 125 },
];

export default modes;
