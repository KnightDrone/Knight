import axios from "axios";

/**
 * Sends a notification to a specific subscriber.
 * @param subId - The ID of the subscriber.
 * @param title - The title of the notification.
 * @param message - The message of the notification.
 */
export const notifySubId = async (
  subId: string,
  title: string,
  message: string
) => {
  await axios.post(`https://app.nativenotify.com/api/indie/notification`, {
    subID: subId,
    appId: process.env.NN_APP_ID,
    appToken: process.env.NN_APP_TOKEN,
    title: title,
    message: message,
  });
};

/**
 * Sends a notification to a group of subscribers.
 * @param group - An array of subscriber IDs.
 * @param title - The title of the notification.
 * @param message - The message of the notification.
 */
export const notifyGroup = async (
  group: string[],
  title: string,
  message: string
) => {
  await axios.post(`https://app.nativenotify.com/api/group/notification`, {
    subIDs: group,
    appId: process.env.NN_APP_ID,
    appToken: process.env.NN_APP_TOKEN,
    title: title,
    message: message,
  });
};

/**
 * Sends a notification for a new order placed to all subscribers.
 */
export const notifyNewOrderPlaced = async () => {
  const allSubs: string[] = await getAllSubs();
  const subs: string[] = allSubs.map((sub: any) => sub.sub_id);

  const title = "New Order Placed";
  const message = "A new order has been placed. Please check the orders tab.";

  const userTitle = "Order Placed";
  const userMessage = "Your order has been placed. Thanks.";

  subs.forEach(async (sub) => {
    if (sub.includes("user")) {
      await notifySubId(sub, userTitle, userMessage);
    } else {
      await notifySubId(sub, title, message);
    }
  });
};

/**
 * Retrieves all subscribers.
 * @returns An array of subscriber objects.
 */
export const getAllSubs = async () => {
  const url = `https://app.nativenotify.com/api/expo/indie/subs/21613/05aBcZfbAB8NN0DGW8UNJ8`;
  const response = await axios.get(url);
  console.log(response.data);
  return response.data;
};
