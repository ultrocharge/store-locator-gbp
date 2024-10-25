import { deleteRecord, ActionOptions, DeleteLocationsActionContext } from "gadget-server";

/**
 * @param { DeleteLocationsActionContext } context
 */
export async function run({ params, record, logger, api, connections }) {
  await deleteRecord(record);
};

/** @type { ActionOptions } */
export const options = {
  actionType: "delete",
};
