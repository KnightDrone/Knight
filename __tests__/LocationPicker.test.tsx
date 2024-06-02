import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LocationPicker from "../src/app/maps/offline/LocationPicker";
import * as FileSystem from "expo-file-system";
import { downloadTiles } from "../src/app/maps/offline/DownloadTiles";

jest.mock("expo-file-system", () => ({
  documentDirectory: "/path/to/document/directory",
  getInfoAsync: jest.fn(),
  readAsStringAsync: jest.fn(),
}));

jest.mock("../src/app/maps/offline/DownloadTiles", () => ({
  downloadTiles: jest.fn(),
}));

describe("LocationPicker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByTestId } = render(
      <LocationPicker navigation={{ goBack: jest.fn() }} />
    );
    const userDrawerButton = getByTestId("user-drawer-button");
    expect(userDrawerButton).toBeDefined();
  });

  it("loads initial location from file", async () => {
    const mockLocation = { latitude: 37.7749, longitude: -122.4194 };
    jest
      .mocked(FileSystem.getInfoAsync)
      .mockResolvedValueOnce({ exists: true } as any);
    jest
      .mocked(FileSystem.readAsStringAsync)
      .mockResolvedValueOnce(JSON.stringify(mockLocation));

    const { getByTestId } = render(
      <LocationPicker navigation={{ goBack: jest.fn() }} />
    );
    await waitFor(() => expect(FileSystem.getInfoAsync).toHaveBeenCalled());
    expect(FileSystem.readAsStringAsync).toHaveBeenCalled();
  });

  it("handles error when reading location file", async () => {
    const mockError = new Error("Error reading location file");
    jest.mocked(FileSystem.getInfoAsync).mockRejectedValueOnce(mockError);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    render(<LocationPicker navigation={{ goBack: jest.fn() }} />);
    await waitFor(() => expect(FileSystem.getInfoAsync).toHaveBeenCalled());
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error reading location file:",
      mockError
    );
    consoleSpy.mockRestore();
  });

  it("saves location and downloads tiles", async () => {
    const mockRegion = { latitude: 37.7749, longitude: -122.4194 };
    const mockMapName = "Test Map";
    jest.mocked(downloadTiles).mockResolvedValueOnce();

    const { getByText, getByTestId } = render(
      <LocationPicker navigation={{ goBack: jest.fn() }} />
    );
    fireEvent.press(getByText("Save Map"));
    fireEvent.changeText(getByTestId("map-name-input"), mockMapName);

    fireEvent.press(getByText("OK"));

    await waitFor(() =>
      expect(downloadTiles).toHaveBeenCalledWith(
        expect.any(Object),
        mockMapName,
        expect.any(Function)
      )
    );
    expect(downloadTiles).toHaveBeenCalledWith(
      expect.any(Object),
      mockMapName,
      expect.any(Function)
    );
  });

  it("cancels saving location", () => {
    const goBackMock = jest.fn();
    const { getByText } = render(
      <LocationPicker navigation={{ goBack: goBackMock }} />
    );
    fireEvent.press(getByText("Cancel"));
    expect(goBackMock).toHaveBeenCalled();
  });
});
