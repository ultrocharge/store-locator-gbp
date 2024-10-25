import { applyParams, save, ActionOptions, CreateLocationsActionContext } from "gadget-server";

/**
 * @param { CreateLocationsActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};