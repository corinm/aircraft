import axios from "axios";

export const sendNotification = async (
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

    console.log("> Notification sent:", response.data);
  } catch (error) {
    console.error("> Error sending notification:", error);
  }
};
