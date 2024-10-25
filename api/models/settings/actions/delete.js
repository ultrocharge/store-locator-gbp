import { deleteRecord, ActionOptions, DeleteSettingsActionContext } from "gadget-server";

/**
 * @param { DeleteSettingsActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await deleteRecord(record);
};

/** @type { ActionOptions } */
export const options = {
  actionType: "delete",
};
