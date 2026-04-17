import "@/index.css";
import ChromaEchoPage from "@/pages/ChromaEchoPage/ChromaEchoPage";

const onInit = (): void => {
  const app = document.querySelector<HTMLDivElement>("#app");

  if (!app) throw new Error(`You must render a container to mount the app.`);

  const chromaEchoPage = ChromaEchoPage();
  app.appendChild(chromaEchoPage);
};

document.addEventListener("DOMContentLoaded", onInit);
