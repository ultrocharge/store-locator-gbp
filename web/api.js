// Sets up the API client for interacting with your backend. 
// For your API reference, visit: https://docs.gadget.dev/api/store-locator-gbp
import { Client } from "@gadget-client/store-locator-gbp";

export const api = new Client({ environment: window.gadgetConfig.environment });
