import { SyncGoogleProfilesGlobalActionContext } from "gadget-server";

/**
 * @param { SyncGoogleProfilesGlobalActionContext } context
 */
export async function run({ params, logger, api, connections }) {
  // Check if the connection to Google Business Profiles exists
  const googleConnection = connections.googleBusiness;

  if (!googleConnection || !googleConnection.oauthToken) {
    logger.error("Google Business connection not found or oauthToken is undefined.");
    return {
      success: false,
      message: "Google Business connection is not set up correctly. Please check your connections."
    };
  }

  const accessToken = googleConnection.oauthToken;

  try {
    const response = await fetch("https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching store information: ${response.statusText}`);
    }

    const data = await response.json();

    logger.info(`Fetched ${data.locations.length} locations from Google Business Profiles`);

    // Return the fetched data to the frontend
    return {
      success: true,
      locations: data.locations, // Send locations data to the frontend
    };
  } catch (error) {
    logger.error(`Error syncing store information: ${error.message}`);
    return { success: false, message: error.message };
  }
}
