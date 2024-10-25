import { applyParams, save, ActionOptions, CreateStoreLocatorActionContext } from "gadget-server";

/**
 * @param { CreateStoreLocatorActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
