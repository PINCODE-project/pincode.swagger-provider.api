import { ConfigService } from "@nestjs/config";
import { YandexProvider } from "@/modules/auth/provider/services/yandex.provider";
import { GithubProvider } from "@/modules/auth/provider/services/github.provider";
import { TypeOptions } from "@/modules/auth/provider/provider.constants";

export const getProvidersConfig = async (configService: ConfigService): Promise<TypeOptions> => ({
    baseUrl: configService.getOrThrow<string>("APPLICATION_URL"),
    services: [
        new YandexProvider({
            client_id: configService.getOrThrow<string>("YANDEX_CLIENT_ID"),
            client_secret: configService.getOrThrow<string>("YANDEX_CLIENT_SECRET"),
            scopes: ["login:email", "login:avatar", "login:info"],
        }),
        new GithubProvider({
            client_id: configService.getOrThrow<string>("GITHUB_CLIENT_ID"),
            client_secret: configService.getOrThrow<string>("GITHUB_CLIENT_SECRET"),
            scopes: ["read:user", "user:email"],
        }),
    ],
});
