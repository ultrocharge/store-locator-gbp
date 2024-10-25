import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.2.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2024-10",
        enabledModels: [],
        type: "partner",
        scopes: ["read_customers", "read_orders"],
      },
    },
    authentications: {
      settings: {
        redirectOnSignIn: "/",
        signInPath: "/sign-in",
        unauthorizedUserRedirect: "signInPath",
        defaultSignedInRoles: ["signed-in"],
      },
      methods: {
        emailPassword: true,
        googleOAuth: {
          scopes: ["email", "profile"],
          offlineAccess: false,
        },
      },
    },
  },
};
