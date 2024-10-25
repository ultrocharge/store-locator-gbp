import { applyParams, save, ActionOptions, UpdateSettingsActionContext } from "gadget-server";

/**
 * @param { UpdateSettingsActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
};

/** @type { ActionOptions } */
export const options = {
  actionType: "update",
  triggers: { api: true },
};
