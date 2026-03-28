import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    devtools(),
    ...(process.env.NODE_ENV === "development"
      ? [
          nitro({
            routeRules: {
              "/api/**": {
                proxy: "http://localhost:8000/api/**",
              },
              "/admin/api/**": {
                proxy: "http://localhost:8000/admin/api/**",
              },
            },
          }),
        ]
      : []),
    tailwindcss(),
    tanstackStart({
      spa: {
        enabled: true,
      },
    }),
    viteReact(),
  ],
});

export default config;
