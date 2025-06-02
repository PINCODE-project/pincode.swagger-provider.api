import { BaseOAuthService } from "./base-oauth.service";
import { TypeProviderOptions } from "./types/provider-options.types";
import { TypeUserInfo } from "./types/user-info.types";

export class GithubProvider extends BaseOAuthService {
    public constructor(options: TypeProviderOptions) {
        super({
            name: "github",
            authorize_url: "https://github.com/login/oauth/authorize",
            access_url: "https://github.com/login/oauth/access_token",
            profile_url: "https://api.github.com/user",
            scopes: options.scopes,
            client_id: options.client_id,
            client_secret: options.client_secret,
        });
    }

    public async extractUserInfo(data: GithubProfile): Promise<TypeUserInfo> {
        let private_email = "";
        const emailsReq = await fetch("https://api.github.com/user/emails", {
            headers: {
                Authorization: `Bearer ${data.access_token}`,
            },
        });
        const emails: { email: string; primary: boolean }[] = await emailsReq.json();
        if (emails && Array.isArray(emails)) {
            private_email = emails.sort((a, b) => Number(b.primary) - Number(a.primary))[0]?.email;
        }

        return super.extractUserInfo({
            email: (Array.isArray(data.email) ? data.email[0] : data.email) || data.notification_email || private_email,
            name: data.login,
            picture: data.avatar_url,
        });
    }
}

interface GithubProfile {
    login: string;
    id: string;
    client_id: string;
    psuid: string;
    email?: string;
    notification_email?: string;
    default_email?: string;
    is_avatar_empty?: boolean;
    default_avatar_id?: string;
    birthday?: string | null;
    first_name?: string;
    last_name?: string;
    name?: string;
    real_name?: string;
    sex?: "male" | "female" | null;
    default_phone?: { id: number; number: string };
    access_token: string;
    refresh_token?: string;
    avatar_url: string;
}
