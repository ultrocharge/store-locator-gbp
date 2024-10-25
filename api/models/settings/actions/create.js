import { applyParams, save, ActionOptions, CreateSettingsActionContext } from "gadget-server";

/**
 * @param { CreateSettingsActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  applyParams(params, record);
  await save(record);
};

/** @type { ActionOptions } */
export const options = {
  actionType: "create",
};
