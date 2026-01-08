import { createAuthClient } from "better-auth/react";
import { admin as adminPlugin } from "better-auth/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  basePath: "/auth",
  plugins: [adminPlugin()],
});
