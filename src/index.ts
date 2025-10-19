import { SimonSaysPage } from "@src/pages/SimonSaysPage/SimonSaysPage";

const onInit = () => {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  const simonSaysPage = SimonSaysPage();
  app.appendChild(simonSaysPage);
};

document.addEventListener("DOMContentLoaded", onInit);
