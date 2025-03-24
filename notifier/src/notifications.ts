import axios from "axios";

import { logger } from "./logger";

export const sendPushoverNotification = async (
  pushoverToken: string,
  pushoverUser: string,
  message: string
) => {
  try {
    const response = await axios.post(
      "https://api.pushover.net/1/messages.json",
      {
        token: pushoverToken,
        user: pushoverUser,
        message: message,
      }
    );

    logger.debug("Notification sent:", response.data);
  } catch (error) {
    logger.error("> Error sending notification:", error);
  }
};
