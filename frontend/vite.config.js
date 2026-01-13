import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": '"production"',
    process: {},
  },
  build: {
    cssCodeSplit: false,
    lib: {
      entry: "src/index.jsx",
      name: "VetChatbot",
      fileName: "chatbot",
      formats: ["umd"],
    },
  },
});
