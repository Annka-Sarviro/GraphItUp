import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "./src",
  base: "/GraphItUp/",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        chart: resolve(__dirname, "src/chart/chart.html"),
      },
    },
  },
});
