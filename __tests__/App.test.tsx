import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import App from "../src/app/App";

describe("App", () => {
    it("renders correctly", () => {
        const { getByText } = render(<App />);
        const appText = getByText("Tiberiu was here!");

        expect(appText).toBeTruthy();

        const button = getByText("Press me");
        expect(button).toBeTruthy();

        const count = getByText("Count: 0");
        expect(count).toBeTruthy();
    });

    it("increments the count when the button is pressed once", () => {
        render(<App />);
        fireEvent.press(screen.getByText("Press me"));
        expect(screen.getByText("Count: 1")).toBeTruthy();
    });

    it("increments the count when the button is pressed multiple times", () => {
        const { getByText } = render(<App />);

        const button = getByText("Press me");

        fireEvent.press(button);
        expect(getByText("Count: 1")).toBeTruthy();

        fireEvent.press(button);
        expect(getByText("Count: 2")).toBeTruthy();

        fireEvent.press(button);
        expect(getByText("Count: 3")).toBeTruthy();
    });
});
