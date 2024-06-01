import {

notifySubId,
notifyGroup,
notifyNewOrderPlaced,
getAllSubs,
} from "../src/utils/NotificationHandler";
import axios from "axios";



describe("NotificationHandler", () => {
describe("notifySubId", () => {
    it("should send a notification to a specific subscriber", async () => {
        // Mock the axios post method
        const axiosPostMock = jest.spyOn(axios, "post");
        axiosPostMock.mockResolvedValueOnce({ status: 200 });

        const subID = "123";
        const title = "New Notification";
        const message = "You have a new notification";

        await notifySubId(subID, title, message);

        expect(axiosPostMock).toHaveBeenCalled()
    });
});

describe("notifyGroup", () => {
    it("should send a notification to a group of subscribers", async () => {
        // Mock the axios post method
        const axiosPostMock = jest.spyOn(axios, "post");
        axiosPostMock.mockResolvedValueOnce({ status: 200 });

        const group = ["123", "456", "789"];
        const title = "New Notification";
        const message = "You have a new notification";

        await notifyGroup(group, title, message);

        expect(axiosPostMock).toHaveBeenCalled()
    });
});

describe("notifyNewOrderPlaced", () => {
    it("should send a notification for a new order placed to all subscribers", async () => {
        // Mock the axios post method
        const axiosPostMock = jest.spyOn(axios, "post");
        axiosPostMock.mockResolvedValueOnce({ status: 200 });

        await notifyNewOrderPlaced();

        expect(axiosPostMock).toHaveBeenCalled()
    });
});

describe("getAllSubs", () => {
    it("should retrieve all subscribers", async () => {
        // Mock the axios get method
        const axiosGetMock = jest.spyOn(axios, "get");
        axiosGetMock.mockResolvedValueOnce({ status: 200, data: [] });

        const subscribers = await getAllSubs();

        expect(axiosGetMock).toHaveBeenCalled();
    });
});
});