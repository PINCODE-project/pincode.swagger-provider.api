import * as dotenv from "dotenv";
dotenv.config();

export const baseUrl = process.env.API_URL || "http://localhost:3000";

export const testUserData = {
    email: process.env.TEST_EMAIL,
    password: process.env.TEST_PASSWORD,
};
