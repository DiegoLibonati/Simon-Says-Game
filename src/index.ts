import "@/index.css";
import { SimonSaysPage } from "@/pages/SimonSaysPage/SimonSaysPage";

const onInit = (): void => {
  const app = document.querySelector<HTMLDivElement>("#app");

  if (!app) throw new Error(`You must render a container to mount the app.`);

  const simonSaysPage = SimonSaysPage();
  app.appendChild(simonSaysPage);
};

document.addEventListener("DOMContentLoaded", onInit);
