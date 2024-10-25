import { applyParams, save, ActionOptions, UpdateStoreLocatorActionContext } from "gadget-server";

/**
 * @param { UpdateStoreLocatorActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
