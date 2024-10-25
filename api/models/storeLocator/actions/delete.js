import { deleteRecord, ActionOptions, DeleteStoreLocatorActionContext } from "gadget-server";

/**
 * @param { DeleteStoreLocatorActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await deleteRecord(record);
};

/** @type { ActionOptions } */
export const options = {
  actionType: "delete",
};
