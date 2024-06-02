import * as FileSystem from "expo-file-system";
import { downloadTiles } from "../src/app/maps/offline/DownloadTiles"; // Adjust the import to your file's path

jest.mock("expo-file-system", () => ({
  documentDirectory: "file:///mocked-document-directory/",
  makeDirectoryAsync: jest.fn(),
  getInfoAsync: jest.fn(),
  downloadAsync: jest.fn(),
}));

describe("downloadTiles", () => {
  const mockLocation = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const mockName = "test-map";
  const mockOnProgress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: false });
    (FileSystem.downloadAsync as jest.Mock).mockResolvedValue({});
  });

  it("creates directory for tiles", async () => {
    await downloadTiles(mockLocation, mockName, mockOnProgress);

    expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith(
      "file:///mocked-document-directory/offline-maps/test-map",
      { intermediates: true }
    );
  });

  it("downloads tiles and calls onProgress", async () => {
    await downloadTiles(mockLocation, mockName, mockOnProgress);

    const expectedTileCount = 15 * 15;
    expect(FileSystem.downloadAsync).toHaveBeenCalledTimes(expectedTileCount);
    expect(mockOnProgress).toHaveBeenCalledTimes(expectedTileCount);
    expect(mockOnProgress).toHaveBeenCalledWith(expect.any(Number));
  });

  it("skips downloading if tile already exists", async () => {
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ exists: true });

    await downloadTiles(mockLocation, mockName, mockOnProgress);

    expect(FileSystem.downloadAsync).not.toHaveBeenCalled();
  });
});
