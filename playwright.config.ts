import { defineConfig } from "@playwright/test";
import { baseUrl } from "./src/tests/data/testData";

export default defineConfig({
    testDir: "./src/tests/api",
    fullyParallel: true,
    use: {
        baseURL: baseUrl,
    },
    projects: [
        {
            name: "api",
        },
    ],
});
