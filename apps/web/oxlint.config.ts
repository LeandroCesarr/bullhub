import { defineConfig } from "oxlint";
import base from "@bullhub/lint";

export default defineConfig({
  extends: [base],
  env: {
    browser: true,
  }
});
