import { defineConfig } from "oxlint";

export default defineConfig({
  $schema: "./node_modules/oxlint/configuration_schema.json",
  categories: {
    correctness: "error",
    suspicious: "warn",
    perf: "warn",
  },
  plugins: ["typescript", "unicorn", "import", "oxc"],
  env: {
    node: true,
    es2022: true,
  },
  rules: {
    "no-console": "warn",
    "no-unused-vars": "error",
    "no-undef": "error",
    "typescript/no-explicit-any": "warn",
    "typescript/consistent-type-imports": "error",
    "import/no-duplicates": "error",
    "oxc/no-barrel-file": "warn",
  },
  overrides: [
    {
      files: ["**/*.test.ts", "**/*.spec.ts"],
      rules: {
        "no-console": "off",
      },
    },
  ],
});
