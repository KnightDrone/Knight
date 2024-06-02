import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import * as FileSystem from "expo-file-system";
import OfflineMapSettings from "../src/app/maps/offline/OfflineMapSettings";
import { NavigationContainer } from "@react-navigation/native";
import { Alert } from "react-native";

jest.mock("expo-file-system", () => ({
  documentDirectory: "/path/to/document/directory/",
  readDirectoryAsync: jest.fn().mockResolvedValue([]),
  getInfoAsync: jest.fn(),
  deleteAsync: jest.fn(),
}));

jest.spyOn(Alert, "alert");

describe("OfflineMapSettings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Alert.alert = jest.fn();
  });

  const renderWithNavigation = (component: any) => {
    return render(<NavigationContainer>{component}</NavigationContainer>);
  };

  it("renders the component correctly", async () => {
    const navigation = {
      setOptions: jest.fn(),
      navigate: jest.fn(),
      toggleDrawer: jest.fn(),
    };
    const { getByTestId } = renderWithNavigation(
      <OfflineMapSettings navigation={navigation} />
    );

    await waitFor(() => {
      expect(getByTestId("offline-map-settings-screen")).toBeDefined();
      expect(getByTestId("add-map-button")).toBeDefined();
    });
  });

  it('displays "No downloaded maps" message when there are no maps', async () => {
    const navigation = {
      setOptions: jest.fn(),
      navigate: jest.fn(),
      toggleDrawer: jest.fn(),
    };
    (FileSystem.readDirectoryAsync as jest.Mock).mockResolvedValue([]);

    const { getByText } = renderWithNavigation(
      <OfflineMapSettings navigation={navigation} />
    );

    await waitFor(() => {
      expect(getByText("No downloaded maps")).toBeDefined();
    });
  });

  it("displays a list of downloaded maps", async () => {
    const navigation = {
      setOptions: jest.fn(),
      navigate: jest.fn(),
      toggleDrawer: jest.fn(),
    };
    const mockMaps = ["Map 1", "Map 2"];
    (FileSystem.readDirectoryAsync as jest.Mock).mockResolvedValueOnce(
      mockMaps
    );
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
      isDirectory: true,
    });

    const { getByTestId, getByText } = renderWithNavigation(
      <OfflineMapSettings navigation={navigation} />
    );

    await waitFor(() => {
      expect(getByTestId("offlineMapsFlatList")).toBeDefined();
      expect(getByText("Map 1")).toBeDefined();
      expect(getByText("Map 2")).toBeDefined();
    });
  });

  it("navigates to the OfflineMap screen when a map is pressed", async () => {
    const navigation = {
      setOptions: jest.fn(),
      navigate: jest.fn(),
      toggleDrawer: jest.fn(),
    };
    const mockMaps = ["Map 1"];
    (FileSystem.readDirectoryAsync as jest.Mock).mockResolvedValueOnce(
      mockMaps
    );
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
      isDirectory: true,
    });

    const { getByText } = renderWithNavigation(
      <OfflineMapSettings navigation={navigation} />
    );

    await waitFor(() => {
      fireEvent.press(getByText("Map 1"));
    });

    expect(navigation.navigate).toHaveBeenCalledWith("OfflineMap", {
      name: "Map 1",
    });
  });

  it("deletes a map when the delete button is pressed", async () => {
    const navigation = {
      setOptions: jest.fn(),
      navigate: jest.fn(),
      toggleDrawer: jest.fn(),
    };
    const mockMaps = ["Map 1"];
    (FileSystem.readDirectoryAsync as jest.Mock).mockResolvedValueOnce(
      mockMaps
    );
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
      isDirectory: true,
    });
    (FileSystem.deleteAsync as jest.Mock).mockResolvedValue(undefined);

    const { getByTestId } = renderWithNavigation(
      <OfflineMapSettings navigation={navigation} />
    );

    await waitFor(() => {
      fireEvent.press(getByTestId("Map 1-delete-button"));
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      "Delete Map",
      'Are you sure you want to delete the map "Map 1"?',
      expect.any(Array)
    );

    // Simulate pressing the "Delete" button in the alert dialog
    const deleteButton = (Alert.alert as jest.Mock).mock.calls[0][2].find(
      (button: any) => button.text === "Delete"
    );
    deleteButton.onPress();

    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
      "/path/to/document/directory/offline-maps/Map 1",
      { idempotent: true }
    );
  });

  it("navigates to the LocationPicker screen when the add button is pressed", () => {
    const navigation = {
      setOptions: jest.fn(),
      navigate: jest.fn(),
      toggleDrawer: jest.fn(),
    };

    const { getByTestId } = renderWithNavigation(
      <OfflineMapSettings navigation={navigation} />
    );

    fireEvent.press(getByTestId("add-map-button"));

    expect(navigation.navigate).toHaveBeenCalledWith("LocationPicker");
  });
});
