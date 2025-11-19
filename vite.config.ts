import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // ON FORCE L'INJECTION D'UN HEADER QUI TUE LOVABLE À LA RACINE
    headers: {
      "X-Lovable-Chat": "disabled",
      "Access-Control-Expose-Headers": "X-Lovable-Chat",
    },
  },

  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Double protection : variable + header
  define: {
    "window.LOVABLE_CHAT_DISABLED": JSON.stringify(true),
  },
}));