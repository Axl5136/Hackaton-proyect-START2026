import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// si realmente existe componentTagger, importalo aqui
// import componentTagger from "....";

export default defineConfig(({ mode }) => {
  const plugins = [react()];

  // activa componentTagger solo en desarrollo (si lo tienes)
  // if (mode === "development") plugins.push(componentTagger());

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
