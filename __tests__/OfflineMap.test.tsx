import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import * as FileSystem from "expo-file-system";
import { OfflineMap } from "../src/app/maps/offline/OfflineMap";

jest.mock("expo-file-system", () => ({
  documentDirectory: "/path/to/document/directory",
  readDirectoryAsync: jest.fn(),
  readAsStringAsync: jest.fn(),
  EncodingType: {
    Base64: "base64",
  },
}));

describe("OfflineMap", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    const route = {
      params: { name: "Test Map" },
      key: "test-key",
      name: "OfflineMap",
    };
    const { getByText } = render(<OfflineMap route={route as any} />);
    expect(getByText("offline-map.render-map (0%)")).toBeDefined();
  });

  it("loads and renders tiles when the component mounts", async () => {
    const route = {
      params: { name: "Test Map" },
      key: "test-key",
      name: "OfflineMap",
    };
    const mockTiles = [
      { base64: "base64data1", index: 0 },
      { base64: "base64data2", index: 1 },
    ];

    (FileSystem.readDirectoryAsync as jest.Mock).mockResolvedValue([
      "0.png",
      "1.png",
    ]);
    (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValueOnce(
      "base64data1"
    );
    (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValueOnce(
      "base64data2"
    );

    const { queryByText } = render(<OfflineMap route={route as any} />);

    await waitFor(() => {
      expect(queryByText("Rendering Map (0%)")).toBeNull();
    });

    expect(FileSystem.readDirectoryAsync).toHaveBeenCalledWith(
      "/path/to/document/directoryoffline-maps/Test Map"
    );
    expect(FileSystem.readAsStringAsync).toHaveBeenCalledTimes(2);
    expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(
      "/path/to/document/directoryoffline-maps/Test Map/0.png",
      { encoding: "base64" }
    );
    expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(
      "/path/to/document/directoryoffline-maps/Test Map/1.png",
      { encoding: "base64" }
    );
  });

  it("handles error when reading tiles directory", async () => {
    const route = {
      params: { name: "Test Map" },
      key: "test-key",
      name: "OfflineMap",
    };
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (FileSystem.readDirectoryAsync as jest.Mock).mockRejectedValue(
      new Error("Test error")
    );

    const { queryByText } = render(<OfflineMap route={route as any} />);

    await waitFor(() => {
      expect(queryByText("Rendering Map (0%)")).toBeNull();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error reading tiles directory:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it("renders the map name in the header", () => {
    const route = {
      params: { name: "Test Map" },
      key: "test-key",
      name: "OfflineMap",
    };
    const { getByText } = render(<OfflineMap route={route as any} />);
    expect(getByText("Test Map")).toBeDefined();
  });

  it("truncates long map names in the header", () => {
    const route = {
      params: { name: "This is a very long map name" },
      key: "test-key",
      name: "OfflineMap",
    };
    const { getByText, getByTestId } = render(
      <OfflineMap route={route as any} />
    );
    expect(getByText("This is a very lo...")).toBeTruthy();
  });
});
