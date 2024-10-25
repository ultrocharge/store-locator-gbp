import { applyParams, save, ActionOptions, UpdateLocationsActionContext } from "gadget-server";

/**
 * @param { UpdateLocationsActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
};
