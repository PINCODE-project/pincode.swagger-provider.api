import { test, expect } from "@playwright/test";

import { baseUrl, testUserData } from "../data/testData";
import dataGenerator from "../helpers/dataGenerator";

test.describe("Auth API", () => {
    test("POST /auth/login returns 200 and token", async ({ request }) => {
        const response = await request.post(`${baseUrl}/auth/login`, {
            data: {
                email: testUserData.email,
                password: testUserData.password,
            },
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body.meta?.statusCode).toBe(200);
        expect(typeof body.data?.accessToken).toBe("string");
        expect(body.data.accessToken.length).toBeGreaterThan(0);
    });

    test("POST /auth/login returns 400 and error message - User not found", async ({ request }) => {
        const response = await request.post(`${baseUrl}/auth/login`, {
            data: {
                email: "invalid" + testUserData.email,
                password: testUserData.password,
            },
        });

        expect(response.status()).toBe(400);

        const body = await response.json();

        expect(body.meta?.statusCode).toBe(400);
        expect(body.data?.message).toBe("Пользователь не найден.");
    });

    test("POST /auth/login returns 401 and error message - Invalid password", async ({ request }) => {
        const response = await request.post(`${baseUrl}/auth/login`, {
            data: {
                email: testUserData.email,
                password: testUserData.password + "invalid",
            },
        });

        expect(response.status()).toBe(401);

        const body = await response.json();

        expect(body.meta?.statusCode).toBe(401);
        expect(body.data?.message).toBe("Неверный пароль.");
    });

    test("POST /auth/register creates a new user", async ({ request }) => {
        const newUser = {
            name: dataGenerator.generateRandomName(),
            email: dataGenerator.generateRandomEmail(),
            password: dataGenerator.generatePassword(),
        };

        const response = await request.post(`${baseUrl}/auth/register`, {
            data: newUser,
        });

        expect(response.status()).toBe(200);
    });
});
