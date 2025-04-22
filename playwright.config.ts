import { defineConfig } from "@playwright/test";
import { baseUrl } from "./tests/data/testData";

export default defineConfig({
    testDir: "./tests/api",
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
