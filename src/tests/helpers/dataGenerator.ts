import { faker } from "@faker-js/faker";

export class DataGenerator {
    generateRandomEmail(): string {
        return faker.internet.email();
    }

    generateRandomName(): string {
        return faker.person.fullName();
    }

    generatePassword(): string {
        return faker.internet.password({ length: 12, memorable: true });
    }
}

export default new DataGenerator();
