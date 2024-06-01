import axios from "axios";

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

export const notifyNewOrderPlaced = async () => {
  const allSubs: string[] = await getAllSubs();
  const subs: string[] = allSubs.map((sub: any) => sub.sub_id);

  const title = "New Order Placed";
  const message = "A new order has been placed. Please check the orders tab.";

  // Send to all for testing purposes
  subs.forEach(async (sub) => {
    await notifySubId(sub, title, message);
  });
};

export const getAllSubs = async () => {
  const url = `https://app.nativenotify.com/api/expo/indie/subs/21613/05aBcZfbAB8NN0DGW8UNJ8`;
  const response = await axios.get(
    //`https://app.nativenotify.com/api/expo/indie/subs/${process.env.NN_APP_ID}/${process.env.NN_APP_TOKEN}`
    url
  );
  console.log(response.data);
  return response.data;
};
