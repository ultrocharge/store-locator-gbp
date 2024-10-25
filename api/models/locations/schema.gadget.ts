import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "locations" model, go to https://store-locator-gbp.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "xm3LaMyWmOEw",
  fields: {
    business: { type: "json", storageKey: "ko3KFj5DlEU1" },
    service: { type: "json", storageKey: "7DqERlmL-ImJ" },
    timing: { type: "json", storageKey: "w1F6Eg-zlyPT" },
  },
};
