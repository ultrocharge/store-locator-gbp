import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://store-locator-gbp.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "EemkRCVSHCi_",
  fields: {
    email: {
      type: "email",
      validations: { required: true, unique: true },
      storageKey: "nQAxnFZHfeBn",
    },
    emailVerificationToken: {
      type: "string",
      storageKey: "BCvBDLGJkN12",
    },
    emailVerificationTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "aaKaf3WDQDbW",
    },
    emailVerified: {
      type: "boolean",
      default: false,
      storageKey: "CO-LreCVy7CX",
    },
    firstName: { type: "string", storageKey: "O3xyYbl3BekI" },
    googleImageUrl: { type: "url", storageKey: "h-pRl5KpsTRT" },
    googleProfileId: { type: "string", storageKey: "UXxvZEg5O9iS" },
    lastName: { type: "string", storageKey: "8mkf71bts4Hj" },
    lastSignedIn: {
      type: "dateTime",
      includeTime: true,
      storageKey: "XB-n0JGTxH81",
    },
    locations: { type: "json", storageKey: "eIP-ejGosHNO" },
    password: {
      type: "password",
      validations: { strongPassword: true },
      storageKey: "A6Yzy54bOq9m",
    },
    permission: { type: "json", storageKey: "1CdnuUbbC56Z" },
    phoneNumber: { type: "string", storageKey: "HN6-Sv8CRv5X" },
    resetPasswordToken: {
      type: "string",
      storageKey: "f4NxmLRcXPk2",
    },
    resetPasswordTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "DZAf6bB8xOqA",
    },
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "fsxaqUjhekLl",
    },
  },
};
