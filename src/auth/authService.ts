import { UserManager, UserManagerSettings, WebStorageStateStore } from "oidc-client-ts";

let userManager: UserManager | undefined;

export function getUserManager(): UserManager {
  if (typeof window === "undefined") {
    throw new Error("UserManager can only be used in the browser");
  }

  if (!userManager) {
    const appOrigin =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_ORIGIN ?? "http://localhost:3000";

    const authority =
      process.env.NEXT_PUBLIC_IDENTITY_SERVER_BASE ??
      process.env.NEXT_PUBLIC_IDENTITY_URL ??
      "https://localhost:7160";

    const settings: UserManagerSettings = {
      authority,
      client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID ?? "react-client",
      redirect_uri: `${appOrigin}/callback`,
      response_type: "code",
      scope: process.env.NEXT_PUBLIC_OIDC_SCOPE ?? "openid profile backend-api offline_access",
      post_logout_redirect_uri: appOrigin,
      userStore: new WebStorageStateStore({ store: window.localStorage }),
    };

    userManager = new UserManager(settings);
  }

  return userManager;
}
