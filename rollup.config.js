import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "src/index.js",
    output: [
      {
        file: "dist/index.esm.js",
        format: "esm",
        sourcemap: true
      },
      {
        file: "dist/index.cjs.js",
        format: "cjs",
        sourcemap: true,
        exports: "named"
      }
    ],
    plugins: [
      babel({
        babelHelpers: "bundled",
        presets: [
          [
            "@babel/preset-env",
            {
              targets: { browsers: "defaults" },
              modules: false
            }
          ]
        ],
        exclude: "node_modules/**"
      }),
      terser()
    ]
  }
];
