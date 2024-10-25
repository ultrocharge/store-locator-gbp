import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "storeLocator" model, go to https://store-locator-gbp.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "w1PS9com8z1x",
  fields: {
    bannerImageUrl: { type: "string", storageKey: "FSWc60xaR57p" },
    businessInfo: { type: "json", storageKey: "Y772nA9DdTOY" },
    hourFormat: { type: "string", storageKey: "DNmZHFJRl5PT" },
    openLocations: { type: "string", storageKey: "RcQq37oK5pKE" },
    ratings: { type: "string", storageKey: "dtuy6tz_ekkt" },
    reviews: { type: "string", storageKey: "bFuhwlIB_dWU" },
    storeGroup: {
      type: "string",
      default: "",
      storageKey: "WQNRuprUK9JM",
    },
    tracking: { type: "json", storageKey: "9iOG6k-oubJX" },
  },
};
