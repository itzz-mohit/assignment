import React from "react";
import { createRoot } from "react-dom/client";
import ChatWidget from "./ChatWidget";


const container = document.createElement("div");
container.id = "vet-chatbot-root";
document.body.appendChild(container);

createRoot(container).render(<ChatWidget />);
