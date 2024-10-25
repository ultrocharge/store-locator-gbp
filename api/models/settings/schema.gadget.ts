import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "settings" model, go to https://store-locator-gbp.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "bCrI4JJsm_Wu",
  fields: {
    bannerImageUrl: { type: "string", storageKey: "AWvILwfG3-WJ" },
    distanceFormat: { type: "string", storageKey: "YBLgNiGury5x" },
    googleMapAPI: { type: "string", storageKey: "XAvrn6RQQQUr" },
    locateNotFound: { type: "string", storageKey: "MmyW5Naex-n4" },
    noStoreFound: { type: "string", storageKey: "Ew6vx_qklJhS" },
    pageTitle: { type: "string", storageKey: "kjHltkmuwl0x" },
    radius: { type: "number", storageKey: "2GpdC3pxj6cw" },
    searchBox: { type: "string", storageKey: "aCPR0NTtemn3" },
    searchBtn: { type: "string", storageKey: "URSw5UOZc0yx" },
    searchText: { type: "string", storageKey: "t7xiEP4xd1WJ" },
  },
};
