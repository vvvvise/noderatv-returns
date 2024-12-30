import ReactCompilerOptions from "@vitejs/plugin-react-refresh";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: `happy-dom`,
    include: [`apps/**/*.spec.ts`],
  },
  resolve: {
    alias: {
      "@": `apps`,
    },
  },
  plugins: [
    ReactCompilerOptions(),
    AutoImport({
      imports: ["react", "react-router"],
      dts: false,
      eslintrc: {
        enabled: true,
      },
    }),
    {
      name: `findByTestId`,
      config: () => ({
        test: {
          setupFiles: [`tests/vitest/plugin/findByTestId.ts`],
        },
      }),
    },
  ],
});
